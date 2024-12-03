package com.example.navigation_app.model

import android.os.Parcelable
import kotlinx.parcelize.Parcelize

@Parcelize
data class Menu(val title :String, val shortDescription :String, val longDescription :String) :
    Parcelable
