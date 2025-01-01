export {}

declare global {

    type Menu = {
        mid : number
        name : string
        price : number
        location : APILocation
        imageVersion : number
        shortDescription : string
        deliveryTime : number
    }

    type MenuDetails = {
        mid : number
        name : string
        price : number
        location : APILocation
        imageVersion : number
        shortDescription : string
        deliveryTime : number
        longDescription : string
    }

    type MenuImage = {
        base64 : string
    }

    type MenuWithImage = {
        menu : Menu
        image : MenuImage?
    }

    type MenuDetailsWithImage = {
        menu : MenuDetails
        image : MenuImage
    }

    // Entity For SQLite Database
    type MenuImageWithVersion = {
        MenuId : number,
        Version : number,
        Image : string
    }

}