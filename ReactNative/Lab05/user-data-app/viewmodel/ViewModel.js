import CommunicationController from "../model/CommunicationController";
import User from "../model/User";

export default class ViewModel {

    static async loadUserData(userId) {
        try {
            const userData = await CommunicationController.getUserDetailsById(userId);
            return new User(userData.uid, userData.firstName, userData.lastName);
        } catch (err) {
            throw err;
        }
    }

}