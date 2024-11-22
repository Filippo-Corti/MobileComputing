fun iniziaConA(list :List<String>) {
    list.filter { it.startsWith("A") }.forEach { println(it) }
}

fun piuLungaDi4(list :List<String>) {
    list.filter {it.length > 4}.forEach { println(it) }
}

fun concatenaIniziaConA(list: List<String>) :String {
    return list.filter { it.startsWith("A") }.joinToString("")
}

fun concatenaPiuLungheDi4(list :List<String>) :String {
    return list.filter {it.length > 4}.joinToString("")
}

fun main() {
    val list = listOf("Alice", "Bob", "Antonio", "Francesco")
    
    iniziaConA(list)
    piuLungaDi4(list)
    println(concatenaIniziaConA(list))
    println(concatenaPiuLungheDi4(list))
}