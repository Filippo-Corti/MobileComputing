import AsyncStorageManager from "../model/AsyncStorageManager";
import CommunicationController from "../model/CommunicationController";
import DBController from "../model/DBController";

export default class ViewModel {

    constructor() {
        this.dbController = new DBController();
    }

    async fetchAppStateData() {
        console.log("Fetching...");
        const isFirstLaunch = await AsyncStorageManager.isFirstLaunch();
        console.log("First Launch?", isFirstLaunch);
        if (isFirstLaunch) {
            const sidResult = await CommunicationController.getNewSID();
            await AsyncStorageManager.memorizeSID(sidResult.sid);
            await AsyncStorageManager.memorizeUID(sidResult.uid);
        }
        const sidFromStorage = await AsyncStorageManager.getSID();
        console.log("Sid is:", sidFromStorage);
        // !Important: 
        CommunicationController.SID = sidFromStorage;

        const uidFromStorage = await AsyncStorageManager.getUID();
        console.log("Uid is:", uidFromStorage);
        return {
            firstLaunch: isFirstLaunch,
            sid: sidFromStorage,
            uid: uidFromStorage,
        };
    }

    async fetchTestMenu(menuId) {
        console.log("Fetching Menu nr", menuId);
        try {
            await this.dbController.openDB();
            const menuDetails = await CommunicationController.getMenuDetailsById(menuId);
            console.log("API Call for Menu: ", menuDetails);
            const menuImage = await this.dbController.getMenuImageByVersion(menuId, menuDetails.imageVersion);
            console.log("Menu Image is: ", menuImage);
            if (menuImage) {
                console.log("Found in storage!");
            } else {
                console.log("Not found in storage, need to ask to API");
                const newMenuImage = await CommunicationController.getMenuImageById(menuId);
                console.log("Here's your image", newMenuImage.base64.substring(0, 100));
            }
        } catch (err) {
            console.log("Errore nel fetch del menu", err);
        }
    }


}