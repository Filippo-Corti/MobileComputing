package com.example.progetto_kt.view.components.common.forms

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.drawBehind
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import com.example.progetto_kt.view.styles.Colors
import com.example.progetto_kt.view.styles.Global

@Composable
fun FormField(
    value : String,
    label : String,
    onValueChange : (String) -> Boolean,
    errorMessage : String,
    showError : Boolean,
    keyBoardOptions : KeyboardOptions,
) {

    var isValid by remember { mutableStateOf(onValueChange(value)) }

    Text(
        text = label,
        color = Colors.DARK_GRAY,
        fontFamily = Global.Fonts.Regular,
        fontSize = Global.FontSizes.Small,
        modifier = Modifier.padding(top = 3.dp)
    )

    BasicTextField(
        value = value,
        onValueChange = {
            isValid = onValueChange(it)
        },
        modifier = Modifier.fillMaxWidth()
            .height(45.dp)
            .padding(bottom = 12.dp)
            .drawBehind {
                drawLine(
                    color = Colors.DARK_GRAY,
                    start = Offset(0f, size.height - 1 / 2),
                    end = Offset(size.width, size.height - 1 / 2),
                    strokeWidth = 1.dp.toPx()
                )
            },
        keyboardOptions = keyBoardOptions,
        textStyle = TextStyle(
            textAlign = TextAlign.Start,
            fontFamily = Global.Fonts.Medium,
            color = Colors.BLACK,
            fontSize = Global.FontSizes.Normal,
        ),
        singleLine = true,
        decorationBox = { innerTextField ->
            Row (
                modifier = Modifier.padding(vertical = 6.dp),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.Start
            ){
                innerTextField()
            }
        }
    )

    if (!isValid && showError) {
        Text(
            text = errorMessage,
            color = Color.Red,
            modifier = Modifier.padding(bottom = 6.dp)
        )
    }

}