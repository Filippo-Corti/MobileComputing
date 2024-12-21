package com.example.progetto_kt.model.dataclasses

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable
import java.text.SimpleDateFormat
import java.util.Locale

typealias Timestamp = String

object Timestamps {

    fun Timestamp.toMillis(): Long {
        val format = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss'Z'", Locale.getDefault())
        return format.parse(this)?.time ?: 0L
    }

    fun Timestamp.formatTimestamp(prettyPattern: String): String {
        val format = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss'Z'", Locale.getDefault())
        val date = format.parse(this) ?: return this
        val prettyFormat = SimpleDateFormat(prettyPattern, Locale.getDefault())
        return prettyFormat.format(date)
    }
}

@Serializable
data class Error (
    @SerialName("message") val message : String,
)

@Serializable
data class Location (

    @SerialName("lat")
    val latitude : Double,

    @SerialName("lng")
    val longitude : Double

)
