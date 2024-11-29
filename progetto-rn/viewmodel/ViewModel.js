import APIController from "../model/APIController";
import AsyncStorageController, { KEYS } from "../model/AsyncStorageController";
import User from "../model/types/User";
import Order from "../model/types/Order";
import Menu from "../model/types/Menu";
import DBController from "../model/DBController";
import PositionViewModel from "./PositionViewModel";

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
        this.locationAllowed = false;
    }

    static getViewModel() {
        if (!ViewModel.#viewmodel) {
            ViewModel.#viewmodel = new ViewModel();
        }
        return ViewModel.#viewmodel;
    }

    async fetchLaunchInformation() {
        let sid, uid;
        this.isFirstLaunch = await AsyncStorageController.isFirstLaunch();
        if (this.isFirstLaunch) {
            await AsyncStorageController.set(KEYS.IS_REGISTERED, false);
            const sessionData = await APIController.createNewUserSession();
            this.sid = sessionData.sid;
            this.uid = sessionData.uid;
            await AsyncStorageController.memorizeSessionKeys(sid, uid);
        } else {
            this.uid = await AsyncStorageController.get(KEYS.UID);
            this.sid = await AsyncStorageController.get(KEYS.SID);
        }
        const isRegistered = await AsyncStorageController.get(KEYS.IS_REGISTERED)
        console.log("UID=", this.uid, "SID=", this.sid, "Is Registered?", isRegistered)

        if (!isRegistered) return [null, null]

        const user = await this.getUserDetails();
        const order = new Order(
            id = user.lastOrderId,
            status = user.lastOrderStatus,
        )
        return [user, order];
    }

    async getUserDetails() {
        if (!this.sid || !this.uid) {
            console.error("Session Data is required but it's null");
            throw new Error("An Unexpected Internal Error occurred")
        }

        try {
            const userDetails = await APIController.getUserDetails(this.sid, this.uid);
            return new User(
                id = userDetails.uid,
                fName = userDetails.firstName,
                lName = userDetails.lastName,
                ccFullName = userDetails.cardFullName,
                ccNumber = userDetails.cardNumber,
                ccExpMonth = userDetails.cardExpireMonth,
                ccExpYear = userDetails.cardExpireYear,
                ccCVV = userDetails.cardCVV,
                lastOrderId = userDetails.lastOid,
                lastOrderStatus = userDetails.orderStatus,
            );
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
            return new Order(
                id = orderDetails.oid,
                status = orderDetails.status,
                orderDetailsRetrieved = true,
                menuId = orderDetails.mid,
                creationTimeStamp = orderDetails.creationTimestamp,
                deliveryTimeStamp = orderDetails.deliveryTimestamp,
                deliveryLocation = PositionViewModel.parseLocation(orderDetails.deliveryLocation),
                currentLocation = PositionViewModel.parseLocation(orderDetails.currentPosition),
            )
        } catch (err) {
            console.error(err);
            throw new Error("An Unexpected Error occurred contacting the App Server");
        }
    }

    async getMenuDetails(menuId) {
        if (!this.sid || !this.uid) {
            console.error("Session Data is required but it's null");
            throw new Error("An Unexpected Internal Error occurred")
        }

        try {
            const menuDetails = await APIController.getMenuDetails(this.sid, menuId, latitude = 45.4642, longitude = 9.19); //TODO Fix this;
            return new Menu(
                id = menuDetails.mid,
                name = menuDetails.name,
                price = menuDetails.price,
                location = PositionViewModel.parseLocation(menuDetails.location),
                imageVersion = menuDetails.imageVersion,
                shortDescription = menuDetails.shortDescription,
                deliveryTime = menuDetails.deliveryTime,
                longDescription = menuDetails.longDescription,
            )
        } catch (err) {
            console.error(err);
            throw new Error("An Unexpected Error occurred contacting the App Server");
        }
    }

    async getOrderAndMenuDetails(orderId) {
        if (!this.sid || !this.uid) {
            console.error("Session Data is required but it's null")
            throw new Error("An Unexpected Internal Error occurred")
        }

        try {
            const orderDetails = await this.getOrderDetails(orderId)
            const menuDetails = await this.getMenuDetailsWithImage(orderDetails?.menuId)
            orderDetails.menu = menuDetails
            return orderDetails
        } catch (err) {
            console.error(err);
            throw new Error("An Unexpected Error occurred contacting the App Server");
        }
    }

    async getMenuImage(menuId, imageVersion) {
        try {
            const menuImageInStorage = await this.dbController.getMenuImageByVersion(menuId, imageVersion);
            if (menuImageInStorage) {
                // If it is, just return it
                console.log("Image retrieved from Local DB Storage");
                return menuImageInStorage.Image;
            }
    
            // If it's not, ask the server for the new version...
            let menuImageFromServer = await APIController.getMenuImage(this.sid, menuId);
            if (!menuImageFromServer.startsWith("data:image/jpeg;base64,")) {
                menuImageFromServer = "data:image/jpeg;base64," + menuImageFromServer;
            }
    
            // ...then save the new version in Local DB Storage...
            this.dbController.insertMenuImage(menuId, menuImageFromServer, imageVersion);
    
            // ...then return it
            console.log("Image retrieved via API. Now saved in Storage");
            return menuImageFromServer;
        } catch (err) {
            console.error("Error loading the Menu Image:", err)
        }
    }

    // Retrieves Menu Details + Image, either from Local Storage or from the App Server
    async getMenuDetailsWithImage(menuId) {
        if (!this.sid) {
            console.error("Session Data is required but it's null");
            throw new Error("An Unexpected Internal Error occurred")
        }
        console.log("Fetching All Details for Menu number", menuId);

        try {
            //Check if Image is in Local DB Storage
            const menu = await this.getMenuDetails(menuId);
            menu.image = await this.getMenuImage(menuId, menu.imageVersion);
            return menu;
        } catch (err) {
            console.error(err);
            throw new Error("An Unexpected Error occurred retrieving Data for the Application");
        }
    }

    async getNearestMenus(userPosition) {
        if (!this.sid || !this.uid) {
            console.error("Session Data is required but it's null");
            throw new Error("An Unexpected Internal Error occurred")
        }

        try {
            const menus = [];
            const fetchedMenus = await APIController.getNearestMenus(this.sid, userPosition.latitude, userPosition.longitude);
            console.log("Menus:", fetchedMenus);
            for (const menu of fetchedMenus) {
                menus.push(new Menu(
                    id = menu.mid,
                    name = menu.name,
                    price = menu.price,
                    location = PositionViewModel.parseLocation(menu.location),
                    imageVersion = menu.imageVersion,
                    shortDescription = menu.shortDescription,
                    deliveryTime = menu.deliveryTime,
                    longDescription = menu.longDescription,
                ))
            }
            return menus;
        } catch (err) {
            console.error(err);
            throw new Error("An Unexpected Error occurred contacting the App Server");
        }
    }

    async getNearestMenusWithImages(userPosition) {
        if (!this.sid || !this.uid) {
            console.error("Session Data is required but it's null");
            throw new Error("An Unexpected Internal Error occurred")
        }

        try {
            const menus = [];
            const fetchedMenus = await APIController.getNearestMenus(this.sid, userPosition.latitude, userPosition.longitude);
            console.log("Menus:", fetchedMenus);
            for (const menu of fetchedMenus) {
                menus.push(new Menu(
                    id = menu.mid,
                    name = menu.name,
                    price = menu.price,
                    location = PositionViewModel.parseLocation(menu.location),
                    imageVersion = menu.imageVersion,
                    shortDescription = menu.shortDescription,
                    deliveryTime = menu.deliveryTime,
                    longDescription = menu.longDescription,
                ))
            }
            return menus;
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