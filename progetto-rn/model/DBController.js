import * as SQLite from 'expo-sqlite';

export default class DBController {

    static db = null

    /**
     */
    static async openDB() {
        if (DBController.db) return 
        DBController.db = await SQLite.openDatabaseAsync('imagesDB');
        const query = `
            CREATE TABLE IF NOT EXISTS MenuImages (
                ID      INTEGER PRIMARY KEY AUTOINCREMENT,
                MenuId  INTEGER,
                Version INTEGER,
                Image   TEXT
            )
        `;
        await this.db.execAsync(query);
    }

    /**
     * @param {MenuImageWithVersion} newData 
     */
    static async insertMenuImage(newData) {
        if (!DBController.db) await this.openDB();

        const query = `
            INSERT INTO MenuImages(MenuId, Image, Version)
            VALUES (?, ?, ?)
        `;
        try {
            await DBController.db.runAsync(query, newData.MenuId, newData.Image, newData.Version);
        } catch (err) {
            console.log("Error saving image into Local DB", err);
        }
    }

    /**
     * @param {number} menuId 
     * @param {number} imageVersion 
     * @returns {Promise<MenuImageWithVersion>?}
     */
    static async getMenuImageByVersion(menuId, imageVersion) {
        if (!DBController.db) await this.openDB();

        const query = `
            SELECT * FROM MenuImages
            WHERE MenuId = ? AND Version = ?            
        `;
        try {
            const result = await DBController.db.getFirstAsync(query, menuId, imageVersion);
            return result;
        } catch (err) {
            console.log("Error loading image from Local DB", err);
        }
    }

}