import APIController from "../model/APIController";
import AsyncStorageController, { KEYS } from "../model/AsyncStorageController";
import User from "../model/types/User";
import Order from "../model/types/Order";
import Menu from "../model/types/Menu";
import DBController from "../model/DBController";

export default class ViewModel {

    static #viewmodel = null;

    constructor() {
        if (ViewModel.#viewmodel) {
            throw new Error("Access should happen via getViewModel()");
        }
        this.sid = null;
        this.uid = null;
        this.isFirstLaunch = false;
        this.dbController = new DBController();
    }

    static getViewModel() {
        if (!ViewModel.#viewmodel) {
            ViewModel.#viewmodel = new ViewModel();
        }
        return ViewModel.#viewmodel;
    }

    async fetchLaunchInformation() {
        let sid, uid, isFirstLaunch, isRegistered, userDetails;
        isFirstLaunch = await AsyncStorageController.isFirstLaunch();
        if (isFirstLaunch) {
            this.isFirstLaunch = true;
            await AsyncStorageController.set(KEYS.IS_REGISTERED, false);
            const sessionData = await APIController.createNewUserSession();
            sid = sessionData.sid;
            uid = sessionData.uid;
            await AsyncStorageController.memorizeSessionKeys(sid, uid);
        } else {
            uid = await AsyncStorageController.get(KEYS.UID);
            sid = await AsyncStorageController.get(KEYS.SID);
        }
        isRegistered = await AsyncStorageController.get(KEYS.IS_REGISTERED)
        console.log("UID=", uid, "SID=", sid, "Is Registered?", isRegistered)
        this.sid = sid;
        this.uid = uid;
        if (isRegistered) {
            userDetails = await this.getUserDetails();
        }
        const parsedUserDetails = userDetails
            ? new User(
                userDetails.id,
                userDetails.firstName,
                userDetails.lastName,
                userDetails.cardFullName,
                userDetails.cardNumber,
                userDetails.cardExpireMonth,
                userDetails.cardExpireYear,
                userDetails.cardCVV)
            : null;
        const parsedOrderDetails = userDetails
            ? new Order(userDetails.lastOid, userDetails.orderStatus)
            : null;
        return [parsedUserDetails, parsedOrderDetails];
    }

    async getUserDetails() {
        if (!this.sid || !this.uid) {
            console.error("Session Data is required but it's null");
            throw new Error("An Unexpected Internal Error occurred")
        }

        try {
            return await APIController.getUserDetailsById(this.sid, this.uid);
        } catch (err) {
            console.error(err);
            throw new Error("An Unexpected Error occurred contacting the App Server");
        }
    }

    async updateUserDetails(userFormData) {
        if (!this.sid || !this.uid) {
            console.error("Session Data is required but it's null");
            throw new Error("An Unexpected Internal Error occurred")
        }

        let userDetails = {
            firstName: userFormData.fName,
            lastName: userFormData.lName,
            cardFullName: userFormData.ccFullName,
            cardNumber: userFormData.ccNumber,
            cardExpireMonth: parseInt(userFormData.ccExpMonth),
            cardExpireYear: parseInt(userFormData.ccExpYear),
            cardCVV: userFormData.ccCVV,
        }

        // Filter out undefined values
        userDetails = Object.fromEntries(
            Object.entries(userDetails).filter(([_, value]) => value !== undefined)
        );

        try {
            const result = await APIController.updateUserDetails(this.sid, this.uid, userDetails);
            // Update the local storage
            await AsyncStorageController.set(KEYS.IS_REGISTERED, true);
            return result;
        } catch (err) {
            console.error(err);
            throw new Error("An Unexpected Error occurred contacting the App Server");
        }
    }

    async getOrderDetails(orderId) {
        if (!this.sid || !this.uid) {
            console.error("Session Data is required but it's null");
            throw new Error("An Unexpected Internal Error occurred")
        }

        try {
            const orderDetails = await APIController.getOrderDetails(this.sid, orderId);
            const orderedMenuDetails = await this.getMenuFullDetailsById(orderDetails?.mid);
            if (orderDetails && orderedMenuDetails) {
                return new Order(
                    orderDetails.oid,
                    orderDetails.status,
                    orderDetailsRetrieved = true,
                    orderDetails.mid,
                    orderDetails.creationTimestamp,
                    orderDetails.deliveryTimestamp,
                    orderDetails.deliveryLocation,
                    orderDetails.currentPosition,
                    new Menu(
                        orderedMenuDetails.mid,
                        orderedMenuDetails.name,
                        orderedMenuDetails.price,
                        orderedMenuDetails.location,
                        orderedMenuDetails.imageVersion,
                        orderedMenuDetails.shortDescription,
                        orderedMenuDetails.deliveryTime,
                        orderedMenuDetails.longDescription,
                        orderedMenuDetails.image
                    )
                );
            }
            return null;
        } catch (err) {
            console.error(err);
            throw new Error("An Unexpected Error occurred contacting the App Server");
        }
    }

    // Retrieves Menu Details + Image, either from Local Storage or from the App Server
    async getMenuFullDetailsById(menuId) {
        if (!this.sid) {
            console.error("Session Data is required but it's null");
            throw new Error("An Unexpected Internal Error occurred")
        }

        console.log("Fetching All Details for Menu number", menuId);
        try {
            //Check if Image is in Local DB Storage
            const menuDetails = await APIController.getMenuDetailsById(this.sid, menuId, latitude=45.4642, longitude=9.19); //TODO Fix this
            const menuImageInStorage = await this.dbController.getMenuImageByVersion(menuId, menuDetails.imageVersion);
            if (menuImageInStorage) {

                // If it is, just return it
                console.log("Image retrieved from Local DB Storage");
                return {
                    ...menuDetails,
                    image: menuImageInStorage.Image,
                };

            } else {

                // If it's not, ask the server for the new version...
                let menuImageFromServer = await APIController.getMenuImageById(this.sid, menuId);
                if (!menuImageFromServer.startsWith("data:image/jpeg;base64,")) {
                    menuImageFromServer = "data:image/jpeg;base64," + menuImageFromServer;
                }

                // ...then save the new version in Local DB Storage...
                this.dbController.insertMenuImage(menuId, menuImageFromServer, menuDetails.imageVersion);

                // ...then return it
                console.log("Image retrieved via API. Now saved in Storage");
                return {
                    ...menuDetails,
                    image: menuImageFromServer,
                }

            }
        } catch (err) {
            console.error(err);
            throw new Error("An Unexpected Error occurred retrieving Data for the Application");
        }
    }


}

/*
ON LOAD:
- Check local storage for alreadyLaunched, SID+UID and isRegistered
- If (there's none of that in the storage) {
    - First Launch = true
    - isRegistered = false
    - Ask for a new SID&UID
} else {
  First Launch = false
  if (!SID&UID) {
    - Ask for a new SID&UID
    - isRegistered = false
  }
  if (isRegistered) {
    - Fetch user data using SID&UID, set in the context
  }
}

*/