export default class CreditCard {

    constructor(ccFullName, ccNumber, ccExpMonth, ccExpYear, ccCVC) {   
        this.ccFullName = ccFullName;
        this.ccNumber = ccNumber;
        this.ccExpMonth = ccExpMonth;
        this.ccExpYear = ccExpYear;
        this.ccCVC = ccCVC;
    }

    static validateFullName(ccFullName) {
        if (ccFullName.length < 1) {
            return false;
        }

        if (ccFullName.length > 255) {
            return false;
        }

        return true;
    }

    static validateNumber(ccNumber) {   
        if (ccNumber.length !== 16) {
            return false;
        }

        if (isNaN(ccNumber)) { // Check if it's a number
            return false;
        }   

        return true;
    }

    static validateExpireMonth(ccExpMonth) {    
        if (ccExpMonth < 1 || ccExpMonth > 12) {
            return false;
        }

        return true;
    }

    static validateExpireYear(ccExpYear) {    
        if (ccExpYear < 0) {
            return false;
        }

        return true;
    }

    static validateCCV(ccCVC) {    
        if (ccCVC.length !== 3) {
            return false;
        }

        if (isNaN(ccCVC)) { // Check if it's a number
            return false;
        }

        return true;
    }


}