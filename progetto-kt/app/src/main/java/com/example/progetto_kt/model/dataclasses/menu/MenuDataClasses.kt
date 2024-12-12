package com.example.progetto_kt.model.dataclasses.menu

import com.example.progetto_kt.model.dataclasses.util.Location
import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

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