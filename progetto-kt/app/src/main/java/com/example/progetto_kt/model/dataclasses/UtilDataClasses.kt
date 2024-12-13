package com.example.progetto_kt.model.dataclasses

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

@Serializable
data class Location (

    @SerialName("lat")
    val latitude : Double,

    @SerialName("lng")
    val longitude : Double

)