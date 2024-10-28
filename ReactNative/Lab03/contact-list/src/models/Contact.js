export default class Contact {

    constructor(fname, lname, prefix, number) {
        this.fname = fname
        this.lname = lname
        this.prefix = prefix
        this.number = number
    }

    getFullName() {
        return this.fname + " " + this.lname
    }

    getFullPhoneNumber() {
        return "+" + this.prefix + " " + this.number.substring(0, 3) + " " + this.number.substring(4, 7) + " " + this.number.substring(8)
    }

    


}