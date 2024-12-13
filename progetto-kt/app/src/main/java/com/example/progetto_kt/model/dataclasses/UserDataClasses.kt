package com.example.progetto_kt.model.dataclasses

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

@Serializable
data class UserSession(
    @SerialName("sid") val sid : String,
    @SerialName("uid") val uid : Int
)