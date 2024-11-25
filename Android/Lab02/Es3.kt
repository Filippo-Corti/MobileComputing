open class Media(val title :String, val year :Int = 2000) {
 
    var rating :Double? = null 
    	get() {
            if(field == null)
            	println("Rating non disponibile")
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
    var m :Media = Media("Test")
    println(m)
    m.rating = 100.0 //Valore non valido
    println("Current rating ${m.rating}")
    m.rating = 10.0
    println(m)
}