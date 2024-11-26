export default class User {

    constructor(id, fName, lName, ccFullName, ccNumber, ccExpMonth, ccExpYear, ccCVV) {
        this.id = id;
        this.fName = fName;
        this.lName = lName;
        
        this.ccFullName = ccFullName;
        this.ccNumber = ccNumber;
        this.ccExpMonth = ccExpMonth;
        this.ccExpYear = ccExpYear;
        this.ccCVV = ccCVV;
    }

    static validateId(id) {
        if (id < 0) {
            return false;
        }

        return true
    }

    static validateFirstName(fName) {
        if (!fName) return false;
        if (fName.length <= 0 || fName.length > 15) {
            return false;
        }

        return true;
    }

    static validateLastName(lName) {
        if (!lName) return false;
        if (lName.length <= 0 || lName.length > 15) {
            return false;
        }

        return true;
    }

    static validateFullName(ccFullName) {
        if (!ccFullName) return false;
        if (ccFullName.length <= 0 || ccFullName.length > 31) {
            return false;
        }

        return true;
    }

    static validateNumber(ccNumber) {  
        if (!ccNumber) return false; 
        if (ccNumber.length !== 16) {
            return false;
        }

        if (isNaN(ccNumber)) { // Check if it's a number
            return false;
        }   

        return true;
    }

    static validateExpireMonth(ccExpMonth) {    
        if (!ccExpMonth) return false;
        if (ccExpMonth < 1 || ccExpMonth > 12) {
            return false;
        }

        return true;
    }

    static validateExpireYear(ccExpYear) {    
        if (!ccExpYear) return false;
        if (ccExpYear < 0) {
            return false;
        }

        return true;
    }

    static validateCVV(ccCVV) {    
        if (!ccCVV) return false;
        if (ccCVV.length !== 3) {
            return false;
        }

        if (isNaN(ccCVV)) { // Check if it's a number
            return false;
        }

        return true;
    }


}