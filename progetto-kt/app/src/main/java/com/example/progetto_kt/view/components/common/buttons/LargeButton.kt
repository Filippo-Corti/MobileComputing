package com.example.progetto_kt.view.components.common.buttons

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonColors
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.RectangleShape
import androidx.compose.ui.unit.dp
import com.example.progetto_kt.view.styles.Colors
import com.example.progetto_kt.view.styles.Global

@Composable
fun LargeButton(
    text : String,
    gray: Boolean = false,
    disabled: Boolean = false,
    onPress : () -> Unit
) {

    val bgColor = if (gray || disabled) Colors.LIGHT_GRAY else Colors.BLACK
    val borderColor = if (disabled) Colors.GRAY else Colors.BLACK
    val textColor = if (disabled) Colors.DARK_GRAY else if (gray) Colors.BLACK else Colors.WHITE

    Button(
        colors = ButtonColors(
            containerColor = bgColor,
            contentColor = textColor,
            disabledContentColor = textColor,
            disabledContainerColor = bgColor
        ),
        border = BorderStroke(2.dp, borderColor),
        shape = RectangleShape,
        modifier = Modifier
            .fillMaxWidth(),
        onClick = onPress
    ) {
        Text(
            text = text,
            fontFamily = Global.Fonts.Medium,
            fontSize = Global.FontSizes.Normal,
            color = textColor,
            modifier = Modifier
                .padding(10.dp)
        )
    }
}