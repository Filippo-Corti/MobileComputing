
export default class CommunicationController {

    static BASE_URL = "https://develop.ewlab.di.unimi.it/mc/2425/"
    static SID = "afM833kms0ri8TzaGItdoOjhb9ss8uJ6gujDy1wELhVglRqeRUh2LaKRP7AyyVS8"

    static async genericRequest(endpoint, verb, queryParams, bodyParams) {
        const queryParamsFormatted = new URLSearchParams(queryParams).toString();
        const url = this.BASE_URL + endpoint + "?" + queryParamsFormatted;

        const fetchData = {
            method: verb,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            }
        }

        if (verb !== 'GET') {
            fetchData.body = JSON.stringify(bodyParams)
        }

        const httpResponse = await fetch(url, fetchData)

        if (httpResponse.status == 200) {
            return await httpResponse.json();
        } else {
            const errorMessage = await httpResponse.text();
            throw new Error("Error message from the server. HTTP status: " + httpResponse.status + " " + errorMessage)
        }

    }

    static async genericRequestWithSID(endpoint, verb, queryParams, bodyParams) {
        queryParams = {
            ...queryParams,
            sid: this.SID,
        }
        return await this.genericRequest(endpoint, verb, queryParams, bodyParams)
    }

    static async genericGETRequest(endpoint, queryParams) {
        return await this.genericRequest(endpoint, "GET", queryParams)
    }

    static async genericGETRequestWithSID(endpoint, queryParams) { 
        return await this.genericRequestWithSID(endpoint, "GET", queryParams)
    }

    static async genericPOSTRequest(endpoint, bodyParams) {
        return await this.genericRequest(endpoint, "POST", {}, bodyParams)
    }

    static async genericPOSTRequestWithSID(endpoint, bodyParams) {
        return await this.genericRequestWithSID(endpoint, "POST", {}, bodyParams)
    }

    static async getUserDetailsById(id) {
        return await this.genericGETRequestWithSID("user/" + id)
    }

    static async registerNewUser(userData) {
        return await this.genericPOSTRequestWithSID("user", userData)
    }

}