import AsyncStorage from '@react-native-async-storage/async-storage';

export default class AsyncStorageManager {

    static HAS_ALREADY_RUN = "hasAlreadyRun";
    static SID = "SID";
    static UID = "UID";

    static async isFirstLaunch() {
        const alreadyRun = await AsyncStorage.getItem(this.HAS_ALREADY_RUN);
        if (alreadyRun == null) {
            AsyncStorage.setItem(this.HAS_ALREADY_RUN, JSON.stringify(true))    
            return true;
        }
        return false;
    }

    static async getSID() {
        return await AsyncStorage.getItem(this.SID);
    }

    static async memorizeSID(sid) {
        return await AsyncStorage.setItem(this.SID, sid);
    }

    static async getUID() {
        return await AsyncStorage.getItem(this.UID);
    }

    static async memorizeUID(uid) {
        return await AsyncStorage.setItem(this.UID, JSON.stringify(uid));
    }

    //Add methods to save current screen 

}