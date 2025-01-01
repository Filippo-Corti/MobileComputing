export default class AccountFormViewModel {

    /**
     * @param {string} firstName
     * @returns {boolean} 
     */
    static validateFirstName(firstName) {
        return !(firstName.length === 0 || firstName.length > 15);
    }

    /**
     * @param {string} lastName
     * @returns {boolean} 
     */
    static validateLastName(lastName) {
        return !(lastName.length === 0 || lastName.length > 15);
    }

    /**
     * @param {string} cardFullName
     * @returns {boolean} 
     */
    static validateCardFullName(cardFullName) {
        return !(cardFullName.length === 0 || cardFullName.length > 31);
    }

    /**
     * @param {string} cardNumber
     * @returns {boolean} 
     */
    static validateCardNumber(cardNumber) {
        return (cardNumber.length === 16 && !isNaN(Number(cardNumber)));
    }

    /**
     * @param {number} cardExpireMonth
     * @returns {boolean} 
     */
    static validateCardExpireMonth(cardExpireMonth) {
        return (cardExpireMonth >= 1 && cardExpireMonth <= 12);
    }

    /**
     * @param {number} cardExpireYear
     * @returns {boolean} 
     */
    static validateCardExpireYear(cardExpireYear) {
        return (cardExpireYear >= new Date().getFullYear());
    }

    /**
     * @param {string} cardCVV
     * @returns {boolean} 
     */
    static validateCardCVV(cardCVV) {
        return (cardCVV.length === 3 && !isNaN(Number(cardCVV)));
    }

}