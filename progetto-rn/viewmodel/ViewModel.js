import APIController from "../model/APIController";
import AsyncStorageController, { KEYS } from "../model/AsyncStorageController";
import User from "../model/types/User";
import Order from "../model/types/Order";

export default class ViewModel {

    static #viewmodel = null;

    constructor() {
        if (ViewModel.#viewmodel) {
            throw new Error("Access should happen via getViewModel()");
        }
        this.sid = null;
        this.uid = null;
        this.isFirstLaunch = false;
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
            if (orderDetails) {
                return new Order(
                    orderDetails.oid, 
                    orderDetails.status, 
                    orderDetailsRetrieved=true,
                    orderDetails.mid,
                    orderDetails.creationTimestamp,
                    orderDetails.deliveryTimestamp,
                    orderDetails.deliveryLocation,
                    orderDetails.currentLocation,
                );
            }
            return null;
        } catch (err) {
            console.error(err);
            throw new Error("An Unexpected Error occurred contacting the App Server");
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