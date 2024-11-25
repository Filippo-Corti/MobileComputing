open class Media(val title :String, val year :Int = 2000) {
 
    var rating :Double? = null 
    	get() {
            if(field == null) {}
            	//println("Rating non disponibile")
            
            return field
        }
        set(value) {
            if (value == null || value < 0 || value > 10) {
                println("Valore non valido per il rating")
            	return
            }
            field = value
        }
    
    override fun toString() :String {
        return "Media(title=$title, year=$year, rating=$rating)"
    }
    
}

class Book(title :String, year :Int = 2000, val author :String) :Media(title, year) {
    
    override fun toString() :String {
        return super.toString().dropLast(1) + ", author=$author)"
    }
    
}

class Film(title :String, year :Int = 2000, val director :String) :Media(title, year) {
     
    override fun toString() :String {
        return super.toString().dropLast(1) + ", director=$director)"
    }
    
}

fun main() {
    val lista = mutableListOf<Media>()
    lista.add(Media("Media", 2023))
    lista.add(Book("Book", author="Steven King"))
    lista.add(Film("Media", 2020, "Nolan"))
   
   	lista.forEach {
        println("Title: ${it.title}")
        if (it is Book) println("Author: ${it.author}")
        if (it is Film) println("Director: ${it.director}")
        println("----")
    }
}