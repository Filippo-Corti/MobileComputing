import CreditCard from "./CreditCard";

export default class User {

    constructor(id, fName, lName, ccInfo = null) {
        this.id = id;
        this.fName = fName;
        this.lName = lName;
        
        if (ccInfo)
            this.creditCard = new CreditCard(ccInfo.ccFullName, ccInfo.ccNumber, ccInfo.ccExpMonth, ccInfo.ccExpYear, ccInfo.ccCVC);
    }

    // Non ho ancora deciso cosa farci con queste validate...

    static validateId(id) {
        if (id < 0) {
            return false;
        }

        return true
    }

    static validateFirstName(fName) {
        if (fName.length > 15) {
            return false;
        }

        return true;
    }

    static validateLastName(lName) {
        if (lName.length > 15) {
            return false;
        }

        return true;
    }


}