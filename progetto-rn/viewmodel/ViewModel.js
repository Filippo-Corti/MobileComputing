import APIController from "../model/APIController";
import AsyncStorageController, {KEYS} from "../model/AsyncStorageController";
import DBController from "../model/DBController";
import MyError from "../model/types/MyError";
import PositionViewModel from "./PositionViewModel";

export default class ViewModel {

    static DEFAULT_LOCATION = {
        lat: 45.4642,
        lng: 9.19,
        address: "Milan, Italy"
    };

    static sid = null;
    static uid = null;

    /**
     * @throws {MyError}
     */
    static assertSessionData() {
        if (!ViewModel.sid || !ViewModel.uid) {
            throw new MyError(
                "NETWORK",
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
    static async isRegistered() {;
        return await AsyncStorageController.get(KEYS.IS_REGISTERED) || false;
    }

    /**
     * @param {string} stack 
     */
    static async saveNavigationStack(stack) {
        await AsyncStorageController.set(KEYS.NAV_STACK, stack);
    }

    /**
     * @returns {Promise<string>?}
     */
    static async getNavigationStack() {
        return await AsyncStorageController.get(KEYS.NAV_STACK);
    }

    /**
     * @returns {Promise<UserSession>}
     */
    static async getUserSession() {
        await ViewModel.fetchUserSession();
        return {
            sid: ViewModel.sid,
            uid: ViewModel.uid
        };
    }

    /**
     */
    static async fetchUserSession() {
        console.log("Fetching User Session");
        const isFirstLaunch = await AsyncStorageController.isFirstLaunch();
        console.log("First Launch Status:", isFirstLaunch);
        if (!isFirstLaunch) {
            console.log("Not First Launch")
            ViewModel.sid = await AsyncStorageController.get(KEYS.SID);
            ViewModel.uid = await AsyncStorageController.get(KEYS.UID);
        } else {
            console.log("First Launch")
            const sessionData = await APIController.createNewUserSession();
            ViewModel.sid = sessionData.sid;
            ViewModel.uid = sessionData.uid;
            await AsyncStorageController.memorizeSessionKeys(ViewModel.sid, ViewModel.uid);
        }
        console.log("SID is ", ViewModel.sid, "UID is ", ViewModel.uid);
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
        user.sid = ViewModel.sid;
        
        await APIController.updateUserDetails(ViewModel.sid, ViewModel.uid, user);
        await AsyncStorageController.set(KEYS.IS_REGISTERED, true);
    }

    /**
     * @param {number} orderId 
     * @returns {Promise<Order>}
     * @throws {MyError}
     */
    static async fetchOrderDetails(orderId) {
        this.assertSessionData();

        const order = await APIController.getOrderDetails(ViewModel.sid, orderId);
        order.currentPosition.address = await PositionViewModel.getAddressFromLocation(order.currentPosition);
        order.deliveryLocation.address = await PositionViewModel.getAddressFromLocation(order.deliveryLocation);
        return order;
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
     * @returns {Promise<Array<MenuWithImage>>}
     * @throws {MyError}
     */
    static async fetchNearbyMenus(latitude, longitude) {
        this.assertSessionData();
        const menus = await APIController.getNearbyMenus(ViewModel.sid, latitude, longitude);
        const menusWithImages = menus.map(menu => ({
            menu: menu,
            image: null
        }))
        return menusWithImages;
    }

    /**
     * @param {number} latitude 
     * @param {number} longitude 
     * @param {number} menuId 
     * @returns {Promise<MenuDetailsWithImage>}
     * @throws {MyError}
     */
    static async fetchMenuDetails(latitude, longitude, menuId) {
        this.assertSessionData();
        const menuDetails = await APIController.getMenuDetails(ViewModel.sid, latitude, longitude, menuId);
        menuDetails.location.address = await PositionViewModel.getAddressFromLocation(menuDetails.location);
        const image = await ViewModel.fetchMenuImage(menuId, menuDetails.imageVersion);
        return {
            menu: menuDetails,
            image: image
        }
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
            menuImageFromServer.base64 = "data:image/jpeg;base64," + menuImageFromServer.base64;
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

    /**
     * @param {number} menuId 
     */
    static async addFavouriteMenu(menuId) {
        await AsyncStorageController.addFavouriteMenu(menuId)
    }

    static async removeFavouriteMenu(menuId) {
        await AsyncStorageController.removeFavouriteMenu(menuId)
    }

    /**
     * @returns {Promise<Array<number>>}
     */
    static async getFavouriteMenus() {
        return await AsyncStorageController.get(KEYS.FAVOURITES)
    }

    static async getFavouriteMenusDetails() {
        const favouriteIds = await this.getFavouriteMenus()
        const favourites = []
        for (const id of favouriteIds) {
            const menuDetails = await ViewModel.fetchMenuDetails(
                ViewModel.DEFAULT_LOCATION.lat, 
                ViewModel.DEFAULT_LOCATION.lng,
                id
            )
            favourites.push(menuDetails)
        }
        return favourites
    }

    /**
     * @param {number} menuId 
     * @returns {Promise<boolean>}
     */
    static async isFavouriteMenu(menuId) {
        const favourites = await this.getFavouriteMenus()
        return favourites.includes(menuId)
    }

}