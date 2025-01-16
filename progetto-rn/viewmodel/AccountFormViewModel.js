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
     * @param {number} cardExpireYear
     * @returns {boolean} 
     */ 
    static validateCardExpireDate(cardExpireMonth, cardExpireYear) {
        const today = new Date();
        const currentMonth = today.getMonth() + 1; // Months are 0-based
        const currentYear = today.getFullYear();
        const isExpired = cardExpireYear > currentYear || (cardExpireYear === currentYear && cardExpireMonth >= currentMonth);

        return isExpired && this.validateCardExpireMonth(cardExpireMonth) && this.validateCardExpireYear(cardExpireYear);
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
        return true;
    }

    /**
     * @param {string} cardCVV
     * @returns {boolean} 
     */
    static validateCardCVV(cardCVV) {
        return (cardCVV.length === 3 && !isNaN(Number(cardCVV)));
    }

}