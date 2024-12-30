export {}


declare global {

    type APILocation = {
        lat : number
        lng : number
        address : string?
    }

    type Timestamp = string

    type HTTP_METHOD = "GET" | "POST" | "PUT" | "DELETE"

    type ERROR_TYPE = "NETWORK" | "ACCOUNT_DETAILS" | "POSITION_UNALLOWED" | "INVALID_ACTION"

}