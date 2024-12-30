export {}


declare global {

    type APILocation = {
        lat : number
        lng : number
        address : string?
    }

    type Timestamp = string

    enum ASYNC_STORAGE_KEYS {
        SID = "SID",
        UID = "UID",
        HAS_ALREADY_RUN = "hasAlreadyRun",
        IS_REGISTERED = "isRegistered",
        NAV_STACK = "navStack"
    }

    enum HTTP_METHOD {
        GET = "GET",
        POST = "POST",
        DELETE = "DELETE",
        PUT = "PUT"
    }

    enum ERROR_TYPE {
        NETWORK,
        ACCOUNT_DETAILS,
        POSITION_UNALLOWED,
        INVALID_ACTION
    }

    class MyError extends Error {
        type: ERROR_TYPE;
        title: string;
        message: string;
        actionText?: string;
        dismissText: string;
    
        constructor(
            type: ERROR_TYPE,
            title: string,
            message: string,
            actionText?: string,
            dismissText: string = "Dismiss"
        ) {
            super(message);
            this.type = type;
            this.title = title;
            this.actionText = actionText;
            this.dismissText = dismissText;
        }
    }
    
}