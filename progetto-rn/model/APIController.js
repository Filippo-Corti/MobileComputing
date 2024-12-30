import MyError from "./types/MyError";

export default class APIController {

    static BASE_URL = "https://develop.ewlab.di.unimi.it/mc/2425/";

    /**
     * @param {string} endpoint 
     * @param {HTTP_METHOD} method 
     * @param {object} bodyParams 
     * @param {object} queryParams 
     * @returns {Promise<Response>}
     */
    static async genericRequest(endpoint, method, bodyParams = {}, queryParams = {}) {
        const queryParamsFormatted = new URLSearchParams(queryParams).toString();
        const url = this.BASE_URL + endpoint + "?" + queryParamsFormatted;

        const fetchData = {
            method: method,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        };

        if (method !== 'GET') {
            fetchData.body = JSON.stringify(bodyParams);
        }

        console.log("Sending Request to", url);

        const httpResponse = await fetch(url, fetchData);
        return httpResponse
    }

    /**
     * @returns {Promise<UserSession>}
     * @throws {MyError}
     */
    static async createNewUserSession() {
        const httpResponse = await this.genericRequest(
            "user",
            "POST"
        )

        switch (httpResponse.status) {
            case 200:
                return await httpResponse.json(); // UserSession
            default:
                var message = await httpResponse.text();
                throw new MyError(
                    "NETWORK",
                    "Unexpected Error",
                    "Something wrong happened contacting the server: \n" + message + "\nPlease try closing and re-opening the app."
                );
        }
    }

    /**
     * @param {string} sid 
     * @param {number} userId 
     * @returns {Promise<User>}
     * @throws {MyError}
     */
    static async getUserDetails(sid, userId) {
        console.log("gettingUserDetails")
        const httpResponse = await this.genericRequest(
            "user/" + userId,
            "GET",
            {},
            { sid: sid }
        )

        console.log("getUserDetails", httpResponse.status)

        switch (httpResponse.status) {
            case 200:
                return await httpResponse.json(); // User
            case 401:
                throw new MyError(
                    "NETWORK",
                    "Authentication Error",
                    "We couldn't authenticate you, please try un-installing and re-installing the app."
                );
            case 404:
                throw new MyError(
                    "NETWORK",
                    "This User doesn't Exist",
                    "We couldn't find the user you're looking for. Please consider un-installing and re-installing the app."
                );
            default:
                var message = await httpResponse.text();
                throw new MyError(
                    "NETWORK",
                    "Unexpected Error",
                    "Something wrong happened contacting the server: \n" + message + "\nPlease try closing and re-opening the app."
                );
        }
    }

    /**
     * @param {string} sid 
     * @param {number} userId 
     * @param {UserUpdateParams} user 
     * @throws {MyError}
     */
    static async updateUserDetails(sid, userId, user) {
        const httpResponse = await this.genericRequest(
            "user/" + userId,
            "PUT",
            user,
            { sid: sid }
        )

        switch (httpResponse.status) {
            case 204:
                return;
            case 401:
                throw new MyError(
                    "NETWORK",
                    "Authentication Error",
                    "We couldn't authenticate you, please try un-installing and re-installing the app."
                );
            case 404:
                throw new MyError(
                    "NETWORK",
                    "This User doesn't Exist",
                    "We couldn't find the user you're looking for. Please consider un-installing and re-installing the app."
                );
            default:
                var message = await httpResponse.text();
                throw new MyError(
                    "NETWORK",
                    "Unexpected Error",
                    "Something wrong happened contacting the server: \n" + message + "\nPlease try closing and re-opening the app."
                );
        }
    }

    /**
     * @param {string} sid 
     * @param {number} orderId 
     * @returns {Promise<Order>}
     * @throws {MyError}
     */
    static async getOrderDetails(sid, orderId) {
        const httpResponse = await this.genericRequest(
            "order/" + orderId,
            "GET",
            {},
            { sid: sid }
        )

        switch (httpResponse.status) {
            case 200:
                return await httpResponse.json(); // Order
            case 401:
                throw new MyError(
                    "NETWORK",
                    "Authentication Error",
                    "We couldn't authenticate you, please try un-installing and re-installing the app."
                );
            case 404:
                throw new MyError(
                    "NETWORK",
                    "This Order doesn't Exist",
                    "We couldn't find the order you're looking for. Please consider closing and re-opening the app."
                );
            default:
                var message = await httpResponse.text();
                throw new MyError(
                    "NETWORK",
                    "Unexpected Error",
                    "Something wrong happened contacting the server: \n" + message + "\nPlease try closing and re-opening the app."
                );
        }
    }

    /**
     * @param {string} sid 
     * @param {number} menuId 
     * @param {APILocation} deliveryLocation 
     * @returns {Promise<Order>}
     * @throws {MyError}
     */
    static async orderMenu(sid, menuId, deliveryLocation) {
        const httpResponse = await this.genericRequest(
            "menu/" + menuId + "/buy",
            "POST",
            { // BuyOrderRequest
                sid: sid,
                deliveryLocation: deliveryLocation,
            }
        )

        switch (httpResponse.status) {
            case 200:
                return await httpResponse.json(); // Order
            case 401:
                throw new MyError(
                    "NETWORK",
                    "Authentication Error",
                    "We couldn't authenticate you, please try un-installing and re-installing the app."
                );
            case 403:
                throw new MyError(
                    "ACCOUNT_DETAILS",
                    "Your Credit Card is invalid",
                    "We couldn't validate the credit card you provided. Please check the details and try again.",
                    "Check Card Details"
                );
            case 404:
                throw new MyError(
                    "NETWORK",
                    "This Menu doesn't Exist",
                    "We couldn't find the menu you're looking for. Please consider closing and re-opening the app."
                );
            case 409:
                throw new MyError(
                    "INVALID_ACTION",
                    "An Order is already on its way",
                    "You already have an active order. Please wait for it to be delivered before ordering again."
                );
            default:
                var message = await httpResponse.text();
                throw new MyError(
                    "NETWORK",
                    "Unexpected Error",
                    "Something wrong happened contacting the server: \n" + message + "\nPlease try closing and re-opening the app."
                );
        }
    }

    /**
     * @param {string} sid 
     * @param {number} latitude 
     * @param {number} longitude 
     * @returns {Promise<Array<Menu>>}
     * @throws {MyError}
     */
    static async getNearbyMenus(sid, latitude, longitude) {
        const httpResponse = await this.genericRequest(
            "menu",
            "GET",
            {},
            { sid: sid, lat: latitude, lng: longitude }
        )

        switch (httpResponse.status) {
            case 200:
                return await httpResponse.json(); // Array<Menu>
            case 401:
                throw new MyError(
                    "NETWORK",
                    "Authentication Error",
                    "We couldn't authenticate you, please try un-installing and re-installing the app."
                );
            default:
                var message = await httpResponse.text();
                throw new MyError(
                    "NETWORK",
                    "Unexpected Error",
                    "Something wrong happened contacting the server: \n" + message + "\nPlease try closing and re-opening the app."
                );
        }
    }

    /**
     * @param {string} sid 
     * @param {number} latitude 
     * @param {number} longitude 
     * @param {number} menuId 
     * @returns {Promise<MenuDetails>}
     * @throws {MyError}
     */
    static async getMenuDetails(sid, latitude, longitude, menuId) {
        const httpResponse = await this.genericRequest(
            "menu/" + menuId,
            "GET",
            {},
            { sid: sid, lat: latitude, lng: longitude }
        )

        switch (httpResponse.status) {
            case 200:
                return await httpResponse.json(); // MenuDetails
            case 401:
                throw new MyError(
                    "NETWORK",
                    "Authentication Error",
                    "We couldn't authenticate you, please try un-installing and re-installing the app."
                );
            case 404:
                throw new MyError(
                    "NETWORK",
                    "This Menu doesn't Exist",
                    "We couldn't find the menu you're looking for. Please consider closing and re-opening the app or picking another menu."
                );
            default:
                var message = await httpResponse.text();
                throw new MyError(
                    "NETWORK",
                    "Unexpected Error",
                    "Something wrong happened contacting the server: \n" + message + "\nPlease try closing and re-opening the app."
                );
        }
    }

    /**
     * @param {string} sid 
     * @param {number} menuId 
     * @returns {Promise<MenuImage>}
     * @throws {MyError}
     */
    static async getMenuImage(sid, menuId) {
        const httpResponse = await this.genericRequest(
            "menu/" + menuId + "/image",
            "GET",
            {},
            { sid: sid}
        )

        switch (httpResponse.status) {
            case 200:
                return await httpResponse.json(); // MenuImage
            case 401:
                throw new MyError(
                    "NETWORK",
                    "Authentication Error",
                    "We couldn't authenticate you, please try un-installing and re-installing the app."
                );
            case 404:
                return { base64: "" } // Graceful Degradation
            default:
                var message = await httpResponse.text();
                throw new MyError(
                    "NETWORK",
                    "Unexpected Error",
                    "Something wrong happened contacting the server: \n" + message + "\nPlease try closing and re-opening the app."
                );
        }
    }

}
