import * as SQLite from 'expo-sqlite';

export default class DBController {

    constructor() {
        this.db = null;
    }

    async openDB() {
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

    async insertMenuImage(menuId, menuImage, imageVersion) {
        const query = `
            INSERT INTO MenuImages(MenuId, Image, Version)
            VALUES (?, ?, ?)
        `;
        try {
            await this.db.runAsync(query, menuId, menuImage, imageVersion);
        } catch (err) {
            console.log(err);
        }
    }

    async getMenuImageByVersion(menuId, imageVersion) {
        const query = `
            SELECT * FROM MenuImages
            WHERE MenuId = ? AND Version = ?            
        `;
        try {
            const result = await this.db.getFirstAsync(query, menuId, imageVersion);
            return result;
        } catch (err) {
            console.log(err);
        }
    }

}