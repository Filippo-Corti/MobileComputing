
export default class CommunicationController {

    static BASE_URL = "https://develop.ewlab.di.unimi.it/mc/2425/";
    static SID = "afM833kms0ri8TzaGItdoOjhb9ss8uJ6gujDy1wELhVglRqeRUh2LaKRP7AyyVS8";

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
            return (await httpResponse.json()) || {};
        } else {
            const errorMessage = await httpResponse.text();
            throw new Error(`Error message from the server. HTTP status: ${httpResponse.status} ${errorMessage}`);
        }
    }

    static async genericGETRequest(endpoint, queryParams = {}) {
        return await this.genericRequest(endpoint, "GET", {}, queryParams);
    }

    static async getUserDetailsById(id) {
        const queryParams = { sid: this.SID };
        return await this.genericGETRequest("user/" + id, queryParams);
    }

    static async updateUserDetails(id, newUserDetails) {
        const bodyParams = {
            ...newUserDetails,
            sid: this.SID,
        }   
        return await this.genericRequest("user/" + id, "PUT", bodyParams);
    }
}
