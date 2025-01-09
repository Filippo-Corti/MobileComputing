package com.example.progetto_kt.view.components.common.buttons

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonColors
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.example.progetto_kt.view.components.common.icons.IconNames
import com.example.progetto_kt.view.components.common.icons.MyIcon
import com.example.progetto_kt.view.styles.Colors
import com.example.progetto_kt.view.styles.Global

@Composable
fun ButtonWithArrow(
    text : String,
    onPress: () -> Unit
) {
    Button(
        colors = ButtonColors(
            containerColor = Colors.BLACK,
            contentColor = Colors.WHITE,
            disabledContentColor = Colors.WHITE,
            disabledContainerColor = Colors.BLACK
        ),

        onClick = onPress
    ) {
        Row (
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(5.dp),
        ) {
            Text(
                text = text,
                fontFamily = Global.Fonts.Medium,
                fontSize = Global.FontSizes.Normal,
                color = Colors.WHITE
            )
            MyIcon(
                name = IconNames.ARROW_RIGHT,
                size = 18,
                color = Colors.WHITE
            )
        }
    }
}