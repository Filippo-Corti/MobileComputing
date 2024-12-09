package com.example.api_storage.model.types

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity
data class MenuImageWithVersion(
    @PrimaryKey val menuId : Int,
    val version : Int,
    val image : String
)
