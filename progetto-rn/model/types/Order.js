export default class Order {

    constructor(id, status, orderDetailsRetrieved = false, menuId = null, creationTimeStamp = null, deliveryTimeStamp = null, deliveryLocation = null, currentLocation = null, menu = null) {
        this.id = id;
        this.status = status;
        this.orderDetailsRetrieved = orderDetailsRetrieved;

        this.menuId = menuId;
        this.creationTimeStamp = creationTimeStamp;
        this.deliveryTimeStamp = deliveryTimeStamp;
        this.deliveryLocation = deliveryLocation;
        this.currentLocation = currentLocation;
        this.menu = menu;
    }

    extractArrivalTimeInformation() {
        if (!this.deliveryTimeStamp) return null;

        const date = new Date(this.deliveryTimeStamp);
        return {
            formattedTime: date.toLocaleTimeString(),
            minutesAway: Math.floor((date - new Date()) / 60000),
        };
    }

}