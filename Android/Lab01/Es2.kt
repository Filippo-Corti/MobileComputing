data class Product(val name: String, val price :Double, val quantity :Int)

fun main() {
    val laptop = Product(
        name = "Laptop", 
        price = 999.99, 
        quantity = 5
    )
    val pasta = Product(
        name = "Pa", 
        price = 0.99, 
        quantity = 1
    )
    val acqua = Product(
        name = "Acqua Naturale da 1.0L",
        price = 1.99,
        quantity = 12
    )
    val iphone = Product(
        name = "iPhone 50",
        price = 0.99,
        quantity = 1
    )

    val list = listOf<Product>(laptop, pasta, acqua, iphone) 
    
    stampaLista(list)
}

fun stampaLista(list :List<Product>) {
    for (p in list) {
        print(p.toString() + " ")
        when {
            p.name == "iPhone 50" -> print("mmm, sospetto")
            p.name.length < 3 -> print("nome troppo corto")
            p.name.length > 20 -> print("nome troppo lungo")
        }
    	println()
    }
}