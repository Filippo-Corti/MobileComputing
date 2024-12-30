import * as SQLite from 'expo-sqlite';

export default class DBController {

    static db = null

    static async openDB() {
        if (this.db) return 
        this.db = await SQLite.openDatabaseAsync('imagesDB');
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
        const query = `
            INSERT INTO MenuImages(MenuId, Image, Version)
            VALUES (?, ?, ?)
        `;
        try {
            await this.db.runAsync(query, newData.menuId, newData.image, newData.version);
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
        const query = `
            SELECT * FROM MenuImages
            WHERE MenuId = ? AND Version = ?            
        `;
        try {
            const result = await this.db.getFirstAsync(query, menuId, imageVersion);
            return result;
        } catch (err) {
            console.log("Error loading image from Local DB", err);
        }
    }

}