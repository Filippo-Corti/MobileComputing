package com.example.progetto_kt.model.dataclasses

import androidx.room.Entity
import androidx.room.PrimaryKey
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

@Serializable
data class MenuImage (
    @SerialName("base64") var image : String
)

data class MenuWithImage (
    val menu : Menu,
    val image : MenuImage
)

data class MenuDetailsWithImage (
    val menuDetails : MenuDetails,
    val image : MenuImage
)

@Entity
data class MenuImageWithVersion(
    @PrimaryKey val menuId : Int,
    val version : Int,
    val image : String
)