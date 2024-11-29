
export default class APIController {

    static BASE_URL = "https://develop.ewlab.di.unimi.it/mc/2425/";

    static async genericRequest(endpoint, verb, bodyParams = {}, queryParams = {}) {
        const queryParamsFormatted = new URLSearchParams(queryParams).toString();
        const url = this.BASE_URL + endpoint + "?" + queryParamsFormatted;

        const fetchData = {
            method: verb,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        };

        if (verb !== 'GET') {
            fetchData.body = JSON.stringify(bodyParams);
        }

        const httpResponse = await fetch(url, fetchData);

        if (httpResponse.ok) {
            if (httpResponse.status === 200)
                return await httpResponse.json()
            else 
                return {};
        } else {
            const errorMessage = await httpResponse.text();
            console.log("API Fetch Error:", errorMessage);
            throw new Error(`Error message from the server. HTTP status: ${httpResponse.status} ${errorMessage}`);
        }
    }

    static async genericGETRequest(endpoint, queryParams = {}) {
        return await this.genericRequest(endpoint, "GET", {}, queryParams);
    }

    static async createNewUserSession() {
        return await this.genericRequest("user", "POST");
    }

    static async getUserDetails(sId, userId) {
        const queryParams = { sid: sId};
        return await this.genericGETRequest("user/" + userId, queryParams);
    }

    static async updateUserDetails(sId, userId, newUserDetails) {
        const bodyParams = {
            ...newUserDetails,
            sid: sId,
        }   
        return await this.genericRequest("user/" + userId, "PUT", bodyParams);
    }

    static async getOrderDetails(sId, orderId) {
        const queryParams = { sid: sId};
        return await this.genericGETRequest("order/" + orderId, queryParams);
    }
    
    static async getMenuDetails(sId, menuId, latitude, longitude) {
        const queryParams = { 
            lat: latitude,
            lng: longitude,
            sid: sId, 
        };
        return await this.genericGETRequest("menu/" + menuId, queryParams);
    }

    static async getMenuImage(sId, menuId) {
        const queryParams = { 
            sid: sId, 
        };
        return (await this.genericGETRequest("menu/" + menuId + "/image", queryParams)).base64;
    }


}
