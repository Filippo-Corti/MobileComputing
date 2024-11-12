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

    static async updateUserData(id, userFormData) {

        let userDetails = {
            firstName: userFormData.fName,
            lastName: userFormData.lName,
            cardFullName : userFormData.ccFullName,
            cardNumber: userFormData.ccNumber,
            cardExpireMonth: userFormData.ccExpMonth,
            cardExpireYear: userFormData.ccExpYear,
            cardCVV: userFormData.ccCVC,
        }

        // Filter out undefined values
        userDetails = Object.fromEntries(
            Object.entries(userDetails).filter(([key, value]) => value !== undefined)
        );

        try { 
            const result = await CommunicationController.updateUserDetails(id, userDetails);
            return result;
        } catch (err) {
            throw err;
        }
    }
 
}