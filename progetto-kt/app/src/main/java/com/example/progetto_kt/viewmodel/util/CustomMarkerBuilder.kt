package com.example.progetto_kt.viewmodel.util

import android.content.Context
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.graphics.Canvas
import android.graphics.Paint
import android.graphics.RectF
import androidx.compose.runtime.remember
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.toArgb
import androidx.compose.ui.platform.LocalContext
import androidx.core.content.ContextCompat
import com.example.progetto_kt.R
import com.example.progetto_kt.model.dataclasses.MenuWithImage
import kotlin.io.encoding.Base64
import kotlin.io.encoding.ExperimentalEncodingApi

object CustomMarkerBuilder {

    // Menu.Id + Menu.ImageVersion -> Bitmap
    private val cachedMarkers = mutableMapOf<Pair<Int, Int>, Bitmap>()

    @OptIn(ExperimentalEncodingApi::class)
    fun getCustomMarker(
        context: Context,
        menu : MenuWithImage
    ) : Bitmap {
        if (menu.image == null) {
            return BitmapFactory.decodeResource(context.resources, R.drawable.position_marker)
        }

        if (cachedMarkers.containsKey(menu.menu.id to menu.menu.imageVersion)) {
            return cachedMarkers[menu.menu.id to menu.menu.imageVersion]!!
        }

        val byteArray = Base64.decode(menu.image.raw)
        val bitmap = BitmapFactory.decodeByteArray(byteArray, 0, byteArray.size)

        val combinedBitmap = combineMarkerWithImage(
            context = context,
            markerDrawable = R.drawable.position_marker,
            customBitmap = resizeAndAddBorder(
                bitmap,
                160,
                80F,
                8F,
                Color.Black.toArgb()
            ),
            markerSize = 140,
            customImageSize = 80
        )

        cachedMarkers[menu.menu.id to menu.menu.imageVersion] = combinedBitmap
        return combinedBitmap
    }

    fun combineMarkerWithImage(
        context: Context,
        markerDrawable: Int, // R.drawable.position_marker
        customBitmap: Bitmap, // The bitmap image to overlay
        markerSize: Int, // Size of the marker drawable
        customImageSize: Int // Size of the custom bitmap (for overlay)
    ): Bitmap {
        // Step 1: Get the drawable for the marker (position_marker)
        val markerDrawable = ContextCompat.getDrawable(context, markerDrawable)!!
        val markerBitmap = Bitmap.createBitmap(markerSize, markerSize, Bitmap.Config.ARGB_8888)
        val canvas = Canvas(markerBitmap)
        markerDrawable.setBounds(0, 0, markerSize, markerSize)
        markerDrawable.draw(canvas)

        // Step 2: Prepare the canvas to overlay the custom bitmap on top of the marker
        val customBitmapResized = Bitmap.createScaledBitmap(customBitmap, customImageSize, customImageSize, false)
        val customBitmapX = (markerSize - customImageSize) / 2
        val customBitmapY = (markerSize - customImageSize) / 2 - 10

        // Step 3: Draw the custom image on top of the marker
        val paint = Paint()
        paint.isAntiAlias = true
        paint.isFilterBitmap = true
        canvas.drawBitmap(customBitmapResized, customBitmapX.toFloat(), customBitmapY.toFloat(), paint)

        // The combined bitmap
        return markerBitmap
    }

    fun resizeAndAddBorder(
        bitmap : Bitmap,
        size: Int,
        cornerRadius: Float,
        borderWidth: Float,
        borderColor: Int
    ): Bitmap {
        // Create a new bitmap with the desired size
        val output = Bitmap.createBitmap(size, size, Bitmap.Config.ARGB_8888)
        val canvas = Canvas(output)

        val paint = Paint(Paint.ANTI_ALIAS_FLAG)
        val rect = RectF(borderWidth, borderWidth, size - borderWidth, size - borderWidth)

        // Draw rounded rectangle with the border
        paint.style = Paint.Style.FILL
        canvas.drawRoundRect(rect, cornerRadius, cornerRadius, paint)

        // Draw the bitmap inside the rounded rectangle
        paint.xfermode = android.graphics.PorterDuffXfermode(android.graphics.PorterDuff.Mode.SRC_IN)
        canvas.drawBitmap(bitmap, null, rect, paint)

        // Reset paint to draw the border
        paint.xfermode = null
        paint.style = Paint.Style.STROKE
        paint.color = borderColor
        paint.strokeWidth = borderWidth

        // Draw the border
        canvas.drawRoundRect(rect, cornerRadius, cornerRadius, paint)

        return output
    }

}