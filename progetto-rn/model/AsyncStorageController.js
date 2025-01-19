import AsyncStorage from '@react-native-async-storage/async-storage';

export const KEYS = {
    SID: "SID",
    UID: "UID",
    HAS_ALREADY_RUN: "hasAlreadyRun",
    IS_REGISTERED: "isRegistered",
    NAV_STACK: "navStack",
    FAVOURITES: "savedMenus"
}

export default class AsyncStorageController {

    /**
     * @param {string} key 
     * @returns {Promise<any>?}
     */
    static async get(key) {
        const v = await AsyncStorage.getItem(key);
        if (v == null) return null
        return JSON.parse(v);
    }

    /**
     * @param {string} key 
     * @param {any} value 
     */
    static async set(key, value) {
        await AsyncStorage.setItem(key, JSON.stringify(value), (result) => {
            if (result) {
                console.warn("Failed to set item into AsyncStorage:", result);
            }
        })
    }

    /**
     * @param {string} sid 
     * @param {number} uid 
     */
    static async memorizeSessionKeys(sid, uid) {
        await this.set(KEYS.SID, sid);
        await this.set(KEYS.UID, uid);
    }

    /**
     * @returns {Promise<boolean>}
     */
    static async isFirstLaunch() {
        const alreadyRun = await this.get(KEYS.HAS_ALREADY_RUN);
        if (alreadyRun == null || alreadyRun == false) {
            await this.set(KEYS.HAS_ALREADY_RUN, true);
            await this.set(KEYS.IS_REGISTERED, false);
            return true;
        }
        return false;
    }

    static async addFavouriteMenu(menuId) {
        let currentFavourites = await this.get(KEYS.FAVOURITES)
        if (!currentFavourites) 
            currentFavourites = []

        currentFavourites.push(menuId)
        await this.set(KEYS.FAVOURITES, currentFavourites)
    }

    static async removeFavouriteMenu(menuId) {
        let currentFavourites = await this.get(KEYS.FAVOURITES)
        if (!currentFavourites) 
            currentFavourites = []

        currentFavourites = currentFavourites.filter((id) => id != menuId)
        await this.set(KEYS.FAVOURITES, currentFavourites)
    }


}