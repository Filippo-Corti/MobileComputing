export {}

declare global {
    
    type UserState = {
        user : User? = null
        isUserRegistered : boolean = false
    }

    type LastOrderState = {
        lastOrder : Order? = null
        lastOrderMenu : MenuDetailsWithImage? = null
    }

    type LocationState = {
        lastKnownLocation : APILocation? = null
        isLocationAllowed : boolean = false
        hasCheckedPermission : boolean = false
    }

    type AppState = {
        isLoading : boolean = true
        isFirstLaunch : boolean = true
        error : MyError? = null
    }

}