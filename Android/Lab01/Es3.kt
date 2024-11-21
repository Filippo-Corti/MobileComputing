data class Product(val name: String, val price :Double, val quantity :Int)

fun main() {
    val list = mutableListOf<Product>() 

    val nome :String? = "Prodotto test"
    val prezzo :Double? = 19.00
    val quantita :Int? = 5

    if (nome !== null && prezzo !== null && quantita !== null) {
    } else {
    }
    //val newProd = Product(nome, prezzo, quantita)
    
    
    println(list)
}
