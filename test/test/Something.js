export default class Something {

    /**
     * @param num 
     * @param {SomeObject} obj 
     */
    static testMethod(num, obj) {
        console.log("Doing something with", num, "and", obj)
        console.log("Now I can also do this", obj.a)
        console.log(obj.c)
    }

}