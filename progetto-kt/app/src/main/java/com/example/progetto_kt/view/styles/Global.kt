package com.example.progetto_kt.view.styles

import androidx.compose.ui.text.font.Font
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.unit.sp
import com.example.progetto_kt.R

object Global {

    data object Fonts {
        val Regular = FontFamily(Font(R.font.ubermovetext_regular))
        val Medium = FontFamily(Font(R.font.ubermovetext_medium))
        val Bold = FontFamily(Font(R.font.ubermovetext_bold))
        val Logo = FontFamily(Font(R.font.geologica_medium))
    }

    data object FontSizes {
        val VerySmall = 10.sp
        val Small = 14.sp
        val Normal = 16.sp
        val Subtitle = 20.sp
        val Title = 24.sp
    }


}