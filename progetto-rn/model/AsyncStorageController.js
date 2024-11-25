import AsyncStorage from '@react-native-async-storage/async-storage';

export const KEYS = {
    HAS_ALREADY_RUN: "hasAlreadyRun",
    SID: "SID",
    UID: "UID",
    IS_REGISTERED: "isRegistered",
}

export default class AsyncStorageController {

    static async get(key) {
        const v = await AsyncStorage.getItem(key);
        if (v == null) return null
        return JSON.parse(v);
    }

    static async set(key, value) {
        AsyncStorage.setItem(key, JSON.stringify(value))
    }

    static async memorizeSessionKeys(sid, uid) {
        await this.set(KEYS.SID, sid);
        await this.set(KEYS.UID, uid);
    }

    static async isFirstLaunch() {
        const alreadyRun = await this.get(KEYS.HAS_ALREADY_RUN);
        if (alreadyRun == null || alreadyRun == false) {
            await this.set(KEYS.HAS_ALREADY_RUN, true);
            return true;
        }
        return false;
    }

    //Add methods to save current screen 

}