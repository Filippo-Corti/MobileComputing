export default class Menu {

    constructor(id, name, price, location, imageVersion, shortDescription, deliveryTime, longDescription, image=null, imageLoaded=false) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.location = location;
        this.imageVersion = imageVersion;
        this.shortDescription = shortDescription;
        this.deliveryTime = deliveryTime;
        this.longDescription = longDescription;
        this.image = image;
        this.imageLoaded = imageLoaded;
    }

    formatPrice() {
        return (this.price) ? this.price.toFixed(2) : "";
    }

}