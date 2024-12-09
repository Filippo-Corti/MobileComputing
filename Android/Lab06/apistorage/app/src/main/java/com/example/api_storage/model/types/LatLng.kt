package com.example.api_storage.model.types

import kotlinx.serialization.Serializable

@Serializable
data class LatLng(
    val lat : Float,
    val lng : Float
)
