export default class Order {

    constructor(id, status, orderDetailsRetrieved = false, menuId = null, creationTimeStamp = null, deliveryTimeStamp = null, expectedDeliveryTimeStamp = null, deliveryLocation = null, currentLocation = null, menu = null) {
        this.id = id;
        this.status = status;
        this.orderDetailsRetrieved = orderDetailsRetrieved;

        this.menuId = menuId;
        this.creationTimeStamp = creationTimeStamp;
        this.deliveryTimeStamp = deliveryTimeStamp;
        this.expectedDeliveryTimeStamp = expectedDeliveryTimeStamp;
        this.deliveryLocation = deliveryLocation;
        this.currentLocation = currentLocation;
        this.menu = menu;
    }

}