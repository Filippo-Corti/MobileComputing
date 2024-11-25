open class Media(val title :String, val year :Int) {
    
    constructor(title :String) : this(title, 2000) {}
    
    
    override fun toString() :String {
        return "Media(title=$title, year=$year)"
    }
    
}

class Book(title :String, year :Int, val author :String) :Media(title, year) {
    
    override fun toString() :String {
        return super.toString().dropLast(1) + ", author=$author)"
    }
    
}

class Film(title :String, year :Int, val director :String) :Media(title, year) {
     
    override fun toString() :String {
        return super.toString().dropLast(1) + ", director=$director)"
    }
    
}

fun main() {
    val m :Media = Media("Test")
    println(m)
    val b :Book = Book("Titolo", 2025, "Autore")
    println(b)
    val f :Film = Film("Prova", 2023, "Mario Rossi")
    println(f)
}