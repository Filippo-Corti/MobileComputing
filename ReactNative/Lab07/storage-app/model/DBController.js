import * as SQLite from 'expo-sqlite';

export default class DBController {

    constructor() {
        this.db = null;
    }

    async openDB() {
        this.db = await SQLite.openDatabaseAsync('usersDB');
        const query = `
            CREATE TABLE IF NOT EXISTS MenuImages (
                ID      INTEGER PRIMARY KEY AUTOINCREMENT,
                MenuId  INTEGER
                Image   TEXT
            )
        `;
        await this.db.execAsync(query);
    }

    async insertMenuImage(menuId, menuImage) {
        const query = `
            INSERT INTO MenuImages(MenuId, Image)
            VALUES (?), (?)
        `;
        try {
            await this.db.runAsync(query, menuId, menuImage);
        } catch (err) {
            console.log(err);
        }
    }

    async getMenu() {
        const query = 'SELECT * FROM Users';
        try {
            const result = await this.db.getFirstAsync(query);
            console.log(result);
            return result;
        } catch (err) {
            console.log(err);
        }
    }

    async getAllUsers() {
        const query = 'SELECT * FROM Users';
        try {
            const result = await this.db.getAllAsync(query);
            console.log(result);
            return result;
        } catch (err) {
            console.log(err);
        }
    }

    async 



}