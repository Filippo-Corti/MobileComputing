data class Product(val name: String, val price: Double, val quantity: Int)

fun aggiungiProdotto(list: MutableList<Product>, name: String?, price: Double?, quantity: Int?) {
    if (name != null && price != null && quantity != null) {
        list.add(Product(name, price, quantity))
    } else {
        println("Error adding product:")
        if (name == null) println(" - Name is NULL")
        if (price == null) println(" - Price is NULL")
        if (quantity == null) println(" - Quantity is NULL")
    }
}

fun main() {
    val list = mutableListOf<Product>()

    val nome: String? = "Prodotto test"
    val prezzo: Double? = null
    val quantita: Int? = 5

    println("Before: $list")
    aggiungiProdotto(list, nome, prezzo, quantita)
    println("After: $list")
}
