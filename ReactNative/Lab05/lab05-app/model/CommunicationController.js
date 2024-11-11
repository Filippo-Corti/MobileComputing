
export default class CommunicationController {

    static BASE_URL = "https://develop.ewlab.di.unimi.it/mc/exercises/"
    static SID = "123"

    static async genericRequest(endpoint, verb, queryParams, bodyParams) {
        queryParams = {
            ...queryParams,
            sid: this.SID,
        }
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

    static async genericGETRequest(endpoint, queryParams) {
        return await this.genericRequest(endpoint, "GET", queryParams)
    }

    static async getOrderDetailsById(id) {
        return await this.genericGETRequest("order/" + id)
    }

    static async getOrderDeliveryDateById(id) {
        return await this.genericGETRequest("order/" + id + "/deliveryDate")
    }

}