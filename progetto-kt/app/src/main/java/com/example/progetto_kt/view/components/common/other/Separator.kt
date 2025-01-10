package com.example.progetto_kt.view.components.common.other

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp

@Composable
fun Separator(
    size : Int,
    color : Color
) {
    Box(
       modifier = Modifier
           .fillMaxWidth()
           .height(size.dp)
           .background(color)
    ) {}
}