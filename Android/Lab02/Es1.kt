class Media(val title :String, val year :Int) {
    
    constructor(title :String) : this(title, 2000) {}
    
    
    override fun toString() :String {
        return "Media(title=$title, year=$year)"
    }
    
}

fun main() {
    val m :Media = Media("Test")
    println(m)
}