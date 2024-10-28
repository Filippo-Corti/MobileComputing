export default class Contact {

    static id = 0

    constructor(fname, lname, prefix, number) {
        this.id = Contact.id++
        this.fname = fname
        this.lname = lname
        this.prefix = prefix
        this.number = number
    }

    getFullName() {
        return this.fname + " " + this.lname
    }

    getFullPhoneNumber() {
        return "+" + this.prefix + " " + this.number.substring(0, 3) + " " + this.number.substring(3, 6) + " " + this.number.substring(6)
    }

    


}