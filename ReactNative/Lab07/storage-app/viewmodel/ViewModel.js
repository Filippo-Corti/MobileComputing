import AsyncStorageManager from "../model/AsyncStorageManager";
import CommunicationController from "../model/CommunicationController";


export default class ViewModel {

    static async fetchAppStateData() {
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
        const uidFromStorage = await AsyncStorageManager.getUID();
        console.log("Uid is:", uidFromStorage);
        return {
            firstLaunch: isFirstLaunch,
            sid: sidFromStorage,
            uid: uidFromStorage,
        };
    }

    static async fetchTestMenu(menuId) {
        const menuDetails = CommunicationController.getMenuDetailsById(menuId);
        const menuImageVersion = 
    }


}