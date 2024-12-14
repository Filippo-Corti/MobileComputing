package com.example.progetto_kt.model.dataclasses

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable
import kotlinx.serialization.Transient

enum class OrderStatus(orderStatus: String) {
    ON_DELIVERY("ON_DELIVERY"),
    COMPLETED("COMPLETED"),
}

@Serializable
data class UserSession(
    @SerialName("sid") val sid : String,
    @SerialName("uid") val uid : Int
)

@Serializable
data class CreditCard(
    @SerialName("cardFullName") val fullName : String,
    @SerialName("cardNumber") val number : String,
    @SerialName("cardExpireMonth") val expireMonth : Int,
    @SerialName("cardExpireYear") val expireYear : Int,
    @SerialName("cardCVV") val cvv : String
)

@Serializable
data class User(
    @SerialName("uid") val id : Int,
    @SerialName("firstName") val firstName : String,
    @SerialName("lastName") val lastName : String,
    @SerialName("lastOid") val lastOrderId : Int,
    @SerialName("orderStatus") val orderStatus: OrderStatus,
    @Transient val creditCard : CreditCard = CreditCard("", "", 0, 0, "")
)

@Serializable
data class UserUpdateParams(
    @SerialName("firstName") var firstName : String,
    @SerialName("lastName") var lastName : String,
    @SerialName("cardFullName") var cardFullName : String,
    @SerialName("cardNumber") var cardNumber : String,
    @SerialName("cardExpireMonth") var cardExpireMonth : Int,
    @SerialName("cardExpireYear") var cardExpireYear : Int,
    @SerialName("cardCVV") var cardCVV : String
)