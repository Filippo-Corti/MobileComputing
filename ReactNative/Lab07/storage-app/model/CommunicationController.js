
export default class CommunicationController {

    static BASE_URL = "https://develop.ewlab.di.unimi.it/mc/2425/";
    static SID = null;

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
            throw new Error(`Error message from the server. HTTP status: ${httpResponse.status} ${errorMessage}`);
        }
    }

    static async genericGETRequest(endpoint, queryParams = {}) {
        return await this.genericRequest(endpoint, "GET", {}, queryParams);
    }

    static async getNewSID() {
        return await this.genericRequest("user", "POST");
    }

    static async getUserDetailsById(id) {
        if (!this.SID) 
            throw new Error("Endpoint requires SID but not SID is memorized");
        
        const queryParams = { sid: this.SID };
        return await this.genericGETRequest("user/" + id, queryParams);
    }

    static async updateUserDetails(id, newUserDetails) {
        if (!this.SID) 
            throw new Error("Endpoint requires SID but not SID is memorized");

        const bodyParams = {
            ...newUserDetails,
            sid: this.SID,
        }   
        return await this.genericRequest("user/" + id, "PUT", bodyParams);
    }
    
    static async getMenuDetailsById(id) {
        const queryParams = { 
            lat: 45.4642,
            lng: 9.19,
            sid: this.SID, 
        };
        return await this.genericGETRequest("menu/" + id, queryParams);
    }
}
