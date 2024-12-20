package com.example.progetto_kt.model.dataclasses

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

@Serializable
data class BuyOrderRequest(
    @SerialName("sid") val sid : String,
    @SerialName("deliveryLocation") val deliveryLocation: Location
)

@Serializable
data class Order(
    @SerialName("oid") val id : Int,
    @SerialName("mid") val menuId : Int,
    @SerialName("uid") val userId : Int,
    @SerialName("status") val status : OrderStatus,
    @SerialName("creationTimestamp") val creationTimestamp : Timestamp,
    @SerialName("deliveryTimestamp") val deliveryTimestamp : Timestamp? = null,
    @SerialName("expectedDeliveryTimestamp") val expectedDeliveryTimestamp : Timestamp? = null,
    @SerialName("deliveryLocation") val deliveryLocation : Location,
    @SerialName("currentPosition") val currentLocation : Location,
)