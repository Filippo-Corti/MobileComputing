import APIController from "../model/APIController";
import AsyncStorageController, { KEYS } from "../model/AsyncStorageController";

export default class ViewModel {

    static #viewmodel = null;

    constructor() {
        if (ViewModel.#viewmodel) {
            throw new Error("Access should happen via getViewModel()");
        }
    }

    static getViewModel() {
        if (!ViewModel.#viewmodel) {
            ViewModel.#viewmodel = new ViewModel();
        }
        return ViewModel.#viewmodel;
    }

    static async fetchLaunchInformation() {
        let sid, uid, isFirstLaunch, isRegistered;
        isFirstLaunch = AsyncStorageController.isFirstLaunch();
        if (isFirstLaunch) {
            await AsyncStorageController.set(KEYS.IS_REGISTERED, false);
            const sessionData = await APIController.createNewUserSession();
            uid = sessionData.uid;
            sid = sessionData.sid;
        } else {
            uid = await AsyncStorageController.get(KEYS.UID);
            sid = await AsyncStorageController.get(KEYS.SID);
        }
        isRegistered = await AsyncStorageController.get(KEYS.IS_REGISTERED)
        console.log("UID=", uid, "SID=", sid, "Is Registered?", isRegistered)
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