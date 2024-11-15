import AsyncStorageManager from "../model/AsyncStorageManager";
import APIController from "../model/APIController";
import DBController from "../model/DBController";

export default class ViewModel {

    constructor() {
        this.dbController = new DBController();
        this.sessionData = {
            firstLaunch: false,
            sid: null,
            uid: null,
        }
    }

    async init() {
        await this.dbController.openDB();
        await this.fetchSessionData();
    }

    // Retrieves Session Information (First Session, SID and UID)
    async fetchSessionData() {
        console.log("Fetching Session Data...");

        try {
            const isFirstLaunch = await AsyncStorageManager.isFirstLaunch();
            let sessionKeys = null;
            if (isFirstLaunch) {
                sessionKeys = await APIController.createNewUserSession();
                await AsyncStorageManager.memorizeSessionKeys(sessionKeys.sid, sessionKeys.uid);
            }

            const uid = await AsyncStorageManager.getUID();
            const sid = await AsyncStorageManager.getSID();
    
            this.sessionData = {
                firstLaunch: isFirstLaunch,
                uid: uid,
                sid: sid,
            };
        } catch (err) {
            console.error(err);
            throw new Error("An Unexpected Error occurred starting the Application");
        }
    }

    async getUserDetails() {
        if (!this.sessionData.sid || !this.sessionData.uid) {
            console.error("Session Data is required but it's null");
            throw new Error("An Unexpected Internal Error occurred")
        }

        try {
            return await APIController.getUserDetailsById(this.sessionData.sid, this.sessionData.uid);
        } catch (err) {
            console.error(err);
            throw new Error("An Unexpected Error occurred contacting the App Server");
        }
    }

    async updateUserDetails(userFormData) {
        if (!this.sessionData.sid || !this.sessionData.uid) {
            console.error("Session Data is required but it's null");
            throw new Error("An Unexpected Internal Error occurred")
        }

        let userDetails = {
            firstName: userFormData.fName,
            lastName: userFormData.lName,
            cardFullName: userFormData.ccFullName,
            cardNumber: userFormData.ccNumber,
            cardExpireMonth: userFormData.ccExpMonth,
            cardExpireYear: userFormData.ccExpYear,
            cardCVV: userFormData.ccCVC,
        }

        // Filter out undefined values
        userDetails = Object.fromEntries(
            Object.entries(userDetails).filter(([_, value]) => value !== undefined)
        );

        try {
            return await APIController.updateUserDetails(this.sessionData.sid, this.sessionData.uid, userDetails);
        } catch (err) {
            console.error(err);
            throw new Error("An Unexpected Error occurred contacting the App Server");
        }
    }

    // Retrieves Menu Details + Image, either from Local Storage or from the App Server
    async getMenuFullDetailsById(menuId) {
        if (!this.sessionData.sid) {
            console.error("Session Data is required but it's null");
            throw new Error("An Unexpected Internal Error occurred")
        }

        console.log("Fetching All Details for Menu number", menuId);
        try {
            //Check if Image is in Local DB Storage
            const menuDetails = await APIController.getMenuDetailsById(this.sessionData.sid, menuId);
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
                let menuImageFromServer = await APIController.getMenuImageById(this.sessionData.sid, menuId);
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