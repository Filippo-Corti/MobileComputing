package com.example.progetto_kt.view.components.common.buttons

import androidx.compose.material3.Button
import androidx.compose.material3.ButtonColors
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color
import com.example.progetto_kt.view.styles.Colors
import com.example.progetto_kt.view.styles.Global

@Composable
fun MinimalistButton(
    text : String,
    onPress: () -> Unit
) {
    Button(
        colors = ButtonColors(
            containerColor = Color.Transparent,
            contentColor = Color.Transparent,
            disabledContentColor = Color.Transparent,
            disabledContainerColor = Color.Transparent
        ),

        onClick = onPress
    ) {
        Text(
            text = text,
            fontFamily = Global.Fonts.Medium,
            fontSize = Global.FontSizes.Normal,
            color = Colors.SECONDARY
        )
    }
}