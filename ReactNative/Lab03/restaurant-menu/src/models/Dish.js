export default class Dish {

    static id = 0

    constructor(name, shortDescription, longDescription) {
        this.id = Dish.id++
        this.name = name
        this.shortDescription = shortDescription
        this.longDescription = longDescription
    }

    static getSampleDishes() {
        return [
            new Dish("Pizza", "Descrizione Breve della Pizza", "Descrizione luuuuuuuuuuuuuuuuuuuuuuuuuuunga della Pizza"),
            new Dish("Pasta", "Descrizione Breve della Pasta", "Descrizione luuuuuuuuuuuuuuuuuuuuuuuuuuunga della Pasta"),
            new Dish("Lasagna", "Descrizione Breve della Lasagna", "Descrizione luuuuuuuuuuuuuuuuuuuuuuuuuuunga della Lasagna"),
        ]
    }

}
