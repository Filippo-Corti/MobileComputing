data class Product(val name: String, val price: Double, val quantity: Int)

fun creaProdotto(name: String?, price: Double?, quantity: Int?) :Product? {
    if (name != null && price != null && quantity != null) {
        return Product(name, price, quantity)
    }

    println("Error adding product:")
    if (name == null) println(" - Name is NULL")
    if (price == null) println(" - Price is NULL")
    if (quantity == null) println(" - Quantity is NULL")
    return null
}

fun main() {
    val list = mutableListOf<Product>()

    val nome: String? = "Prodotto test"
    val prezzo: Double? = null
    val quantita: Int? = 5

    creaProdotto(nome, prezzo, quantita)?.let {list.add(it)}
    println("After: $list")
}
