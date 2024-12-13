package com.example.progetto_kt.model.dataclasses

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable
import kotlinx.serialization.Transient

@Serializable
data class Menu (
    @SerialName("mid") val id : Int,
    @SerialName("name") val name : String,
    @SerialName("price") val price : Float,
    @SerialName("location") val location : Location,
    @SerialName("imageVersion") val imageVersion : Int,
    @SerialName("shortDescription") val shortDescription : String,
    @SerialName("deliveryTime") val deliveryTime : Int
)

@Serializable
data class MenuDetails (
    @SerialName("mid") val id : Int,
    @SerialName("name") val name : String,
    @SerialName("price") val price : Float,
    @SerialName("location") val location : Location,
    @SerialName("imageVersion") val imageVersion : Int,
    @SerialName("shortDescription") val shortDescription : String,
    @SerialName("deliveryTime") val deliveryTime : Int,
    @SerialName("longDescription") val longDescription : String,
)