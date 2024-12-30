import AsyncStorage from '@react-native-async-storage/async-storage';

export default class AsyncStorageController {

    /**
     * @param {ASYNC_STORAGE_KEYS} key 
     * @returns {Promise<any>?}
     */
    static async get(key) {
        const v = await AsyncStorage.getItem(key);
        if (v == null) return null
        return JSON.parse(v);
    }

    /**
     * @param {ASYNC_STORAGE_KEYS} key 
     * @param {any} value 
     */
    static async set(key, value) {
        await AsyncStorage.setItem(key, JSON.stringify(value))
    }

    /**
     * @param {string} sid 
     * @param {number} uid 
     */
    static async memorizeSessionKeys(sid, uid) {
        await this.set(ASYNC_STORAGE_KEYS.SID, sid);
        await this.set(ASYNC_STORAGE_KEYS.UID, uid);
    }

    /**
     * @returns {Promise<boolean>}
     */
    static async isFirstLaunch() {
        const alreadyRun = await this.get(ASYNC_STORAGE_KEYS.HAS_ALREADY_RUN);
        if (alreadyRun == null || alreadyRun == false) {
            await this.set(ASYNC_STORAGE_KEYS.HAS_ALREADY_RUN, true);
            await this.set(ASYNC_STORAGE_KEYS.IS_REGISTERED, false);
            return true;
        }
        return false;
    }


}