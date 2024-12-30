export {}

declare global {

    type BuyOrderRequest = {
        sid : string
        deliveryLocation : APILocation
    }

    type Order = {
        oid : number
        mid : number
        uid : number
        status : OrderStatus
        creationTimestamp : Timestamp
        deliveryTimestamp : Timestamp? = null
        expectedDeliveryTimestamp : TimeStamp? = null
        deliveryLocation : APILocation
        currentPosition : APILocation
    }

}