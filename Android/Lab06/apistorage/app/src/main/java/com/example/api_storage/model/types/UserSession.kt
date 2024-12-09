package com.example.navigation_app.model.types

import kotlinx.serialization.Serializable

@Serializable
data class UserSession(
    val sid : String,
    val uid : Int
)
