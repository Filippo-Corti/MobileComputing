import AsyncStorage from '@react-native-async-storage/async-storage';

export default class AsyncStorageManager {

    static STORAGE_KEYS = {
        HAS_ALREADY_RUN: "hasAlreadyRun",
        SID: "SID",
        UID: "UID",
    }

    static async isFirstLaunch() {
        const alreadyRun = await AsyncStorage.getItem(this.STORAGE_KEYS.HAS_ALREADY_RUN);
        if (alreadyRun == null) {
            AsyncStorage.setItem(this.STORAGE_KEYS.HAS_ALREADY_RUN, JSON.stringify(true))
            return true;
        }
        return false;
    }

    static async getSID() {
        return await AsyncStorage.getItem(this.STORAGE_KEYS.SID);
    }

    static async getUID() {
        return await AsyncStorage.getItem(this.STORAGE_KEYS.UID);
    }

    static async memorizeSessionKeys(sid, uid) {
        await AsyncStorage.setItem(this.STORAGE_KEYS.SID, sid);
        await AsyncStorage.setItem(this.STORAGE_KEYS.UID, JSON.stringify(uid));
    }

    //Add methods to save current screen 

}