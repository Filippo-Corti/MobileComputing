import APIController from "../model/APIController";
import AsyncStorageController from "../model/AsyncStorageController";
import DBController from "../model/DBController";

export default class ViewModel {

    static sid = null;
    static uid = null;

    /**
     * @throws {MyError}
     */
    static assertSessionData() {
        if (!ViewModel.sid || !ViewModel.uid) {
            throw new MyError(
                ERROR_TYPE.NETWORK,
                "Authentication Error",
                "We couldn't authenticate you, please try un-installing and re-installing the app.",
                "Try Again"
            );
        }
    }

    /**
     * @returns {Promise<boolean>}
     */
    static async isFirstLaunch() {
        return await AsyncStorageController.isFirstLaunch();
    }

    /**
     * @returns {Promise<boolean>}
     */
    static async isRegistered() {
        return await AsyncStorageController.get(ASYNC_STORAGE_KEYS.IS_REGISTERED) || false;
    }

    /**
     * @param {string} stack 
     */
    static async saveNavigationStack(stack) {
        await AsyncStorageController.set(ASYNC_STORAGE_KEYS.NAV_STACK, stack);
    }

    /**
     * @returns {Promise<string>?}
     */
    static async getNavigationStack() {
        return await AsyncStorageController.get(ASYNC_STORAGE_KEYS.NAV_STACK);
    }

    /**
     * @returns {Promise<UserSession>}
     */
    static async getUserSession() {
        if (!ViewModel.sid || !ViewModel.uid) {
            await ViewModel.fetchUserSession();
        }
        return {
            sid: ViewModel.sid,
            uid: ViewModel.uid
        };
    }

    /**
     */
    static async fetchUserSession() {
        const isFirstLaunch = await AsyncStorageController.isFirstLaunch();
        if (!isFirstLaunch) {
            console.log("Not First Launch")
            ViewModel.sid = await AsyncStorageController.get(ASYNC_STORAGE_KEYS.SID);
            ViewModel.uid = await AsyncStorageController.get(ASYNC_STORAGE_KEYS.UID);
        } else {
            console.log("First Launch")
            const sessionData = await APIController.createNewUserSession();
            ViewModel.sid = sessionData.sid;
            ViewModel.uid = sessionData.uid;
            await AsyncStorageController.memorizeSessionKeys(ViewModel.sid, ViewModel.uid);
        }
    }

    /**
     * @returns {Promise<User>}
     * @throws {MyError}
     */
    static async fetchUserDetails() {
        this.assertSessionData();

        return await APIController.getUserDetails(ViewModel.sid, ViewModel.uid);
    }

    /**
     * @param {UserUpdateParams} user 
     * @throws {MyError}
     */
    static async updateUserDetails(user) {
        this.assertSessionData();

        await APIController.updateUserDetails(ViewModel.sid, ViewModel.uid, user);
        await AsyncStorageController.set(ASYNC_STORAGE_KEYS.IS_REGISTERED, true);
    }

    /**
     * @param {number} orderId 
     * @returns {Promise<Order>}
     * @throws {MyError}
     */
    static async fetchOrderDetails(orderId) {
        this.assertSessionData();

        return await APIController.getOrderDetails(ViewModel.sid, orderId);
    }

    /**
     * @param {number} menuId 
     * @param {APILocation} deliveryLocation 
     * @returns {Promise<Order>}
     * @throws {MyError}
     */
    static async orderMenu(menuId, deliveryLocation) {
        this.assertSessionData();

        return await APIController.orderMenu(ViewModel.sid, menuId, deliveryLocation);
    }

    /**
     * @param {number} latitude 
     * @param {number} longitude 
     * @returns {Promise<Array<Menu>>}
     * @throws {MyError}
     */
    static async fetchNearbyMenus(latitude, longitude) {
        this.assertSessionData();

        return await APIController.getNearbyMenus(ViewModel.sid, latitude, longitude);
    }

    /**
     * @param {number} latitude 
     * @param {number} longitude 
     * @param {number} menuId 
     * @returns {Promise<MenuDetails>}
     * @throws {MyError}
     */
    static async fetchMenuDetails(latitude, longitude, menuId) {
        this.assertSessionData();

        return await APIController.getMenuDetails(ViewModel.sid, latitude, longitude, menuId);
    }

    /**
     * @param {number} menuId 
     * @param {number} imageVersion 
     * @returns {Promise<MenuImage>}
     * @throws {MyError}
     */
    static async fetchMenuImage(menuId, imageVersion) {
        const menuImageInStorage = await DBController.getMenuImageByVersion(menuId, imageVersion);
        if (menuImageInStorage) {
            return {
                base64: menuImageInStorage.Image
            };
        }

        const menuImageFromServer = await APIController.getMenuImage(ViewModel.sid, menuId);
        if (!menuImageFromServer.base64.startsWith("data:image/jpeg;base64,")) {
            menuImageFromServer.base64 = "data:image/jpeg;base64," + menuImageFromServer;
        }

        DBController.insertMenuImage(
            { // MenuImageWithVersion
                MenuId: menuId, 
                Version: imageVersion,
                Image: menuImageFromServer.base64, 
            }
        );

        console.log("Menu Image Fetched from Server. Now in Storage")
        return menuImageFromServer;
    }

    // extractFormattedOrderInformation(orderData) {
    //     const now = new Date()
    //     const creationTime = new Date(orderData.creationTimeStamp)
    //     const expectedDeliveryTime = new Date(orderData.expectedDeliveryTimeStamp)
    //     const deliveryTime = new Date(orderData.deliveryTimeStamp)
    //     const completed = (orderData.status === "COMPLETED")

    //     const totalTime = expectedDeliveryTime - creationTime
    //     const elapsedTime = now - creationTime

    //     const progress = (completed)
    //         ? 100
    //         : Math.max(0, Math.min(100, (elapsedTime / totalTime) * 100))

    //     const minutesAway = Math.floor((((completed) ? deliveryTime : expectedDeliveryTime) - now) / 60000)

    //     return {
    //         deliveryText: (!completed) ? "Arriving at " + expectedDeliveryTime.toLocaleTimeString() : "Arrived at " + deliveryTime.toLocaleTimeString(),
    //         minutesText: (completed) ? (- minutesAway) + " minutes ago" : minutesAway + " minutes away",
    //         progress: progress,
    //         statusText: (completed) ? "Your order has arrived!" : "Almost there..."
    //     }
    // }

}