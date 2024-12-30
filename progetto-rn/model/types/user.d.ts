export {}

declare global {

    enum OrderStatus {
        ON_DELIVERY = "ON _DELIVERY",
        COMPLETED = "COMPLETED"
    }

    type UserSession = {
        sid : string
        uid : number
    }

    type User = {
        uid : number
        firstName : string
        lastName : string
        lastOid : number? = null
        orderStatus : OrderStatus? = null
        cardFullName : string
        cardNumber : string
        cardExpireMonth : number
        cardExpireYear : number
        cardCVV : string
    }

    type UserUpdateParams = {
        firstName : string
        lastName : string
        cardFullName : string
        cardNumber : string
        cardExpireMonth : number
        cardExpireYear : number
        cardCVV : string
        sid : string
    }

}