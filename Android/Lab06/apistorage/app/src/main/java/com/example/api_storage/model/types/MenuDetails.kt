package com.example.api_storage.model.types

import kotlinx.serialization.Serializable

@Serializable
data class MenuDetails(
    val mid : Int,
    val name : String,
    val price : Float,
    val imageVersion : Int,
    val shortDescription : String,
    val location : LatLng,
    val longDescription : String,
    val deliveryTime : Int,
)
