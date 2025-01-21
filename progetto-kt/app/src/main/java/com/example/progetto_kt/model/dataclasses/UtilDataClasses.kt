package com.example.progetto_kt.model.dataclasses

import android.location.Location
import com.mapbox.geojson.Point
import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable
import kotlinx.serialization.Transient
import java.text.SimpleDateFormat
import java.util.Locale
import java.util.TimeZone

typealias Timestamp = String

@Serializable
data class APIError (
    @SerialName("message") val message : String,
)

@Serializable
data class APILocation (

    @SerialName("lat")
    val latitude : Double,

    @SerialName("lng")
    val longitude : Double,

    @Transient
    var address : String? = null

)

fun APILocation.toPoint(): Point {
    return Point.fromLngLat(this.longitude, this.latitude)
}

fun Location.toAPILocation(): APILocation {
    return APILocation(this.latitude, this.longitude)
}

object Timestamps {

    fun Timestamp.toMillis(): Long {
        val format = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", Locale.getDefault())
        format.timeZone = TimeZone.getTimeZone("UTC")
        return format.parse(this)?.time ?: 0L
    }

    fun Timestamp.formatTimestamp() : String {
        val format = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", Locale.getDefault())
        format.timeZone = TimeZone.getTimeZone("UTC")
        val date = format.parse(this) ?: return this
        val prettyFormat = SimpleDateFormat("hh:mm a", Locale.getDefault())
        return prettyFormat.format(date)
    }
}

enum class ErrorType {
    NETWORK,
    ACCOUNT_DETAILS,
    POSITION_UNALLOWED,
    INVALID_ACTION,
}

data class Error(
    val type : ErrorType,
    val title : String = "An Unexpected Error Occurred",
    override val message: String,
    val actionText : String? = null,
    val dismissText : String = "Dismiss"
) : Exception(message)