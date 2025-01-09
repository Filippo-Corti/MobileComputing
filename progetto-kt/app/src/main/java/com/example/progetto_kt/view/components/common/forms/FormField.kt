package com.example.progetto_kt.view.components.common.forms

import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material3.Text
import androidx.compose.material3.TextField
import androidx.compose.material3.TextFieldColors
import androidx.compose.material3.TextFieldDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.style.TextAlign
import com.example.progetto_kt.view.styles.Colors
import com.example.progetto_kt.view.styles.Global

@Composable
fun FormField(
    value : String,
    label : String,
    onValueChange : (String) -> Boolean,
    errorMessage : String,
    keyBoardOptions : KeyboardOptions
) {

    var isValid by remember { mutableStateOf(true) }

    TextField(
        value = value,
        onValueChange = {
            isValid = onValueChange(it)
        },
        label = {
            Text(
                text = label,
                color = Colors.DARK_GRAY,
                fontFamily = Global.Fonts.Regular,
                fontSize = Global.FontSizes.Small
            )
        },
        singleLine = true,
        isError = !isValid,
        keyboardOptions = keyBoardOptions,
        colors = TextFieldDefaults.colors(
            unfocusedContainerColor = Colors.WHITE,
            focusedContainerColor = Colors.WHITE,
            unfocusedLabelColor = Colors.DARK_GRAY,
            focusedLabelColor = Colors.DARK_GRAY,
            unfocusedTextColor = Colors.BLACK,
            focusedTextColor = Colors.BLACK,
            disabledIndicatorColor = Colors.GRAY,
            focusedIndicatorColor = Colors.GRAY,
            unfocusedIndicatorColor = Colors.GRAY
        ),
        textStyle = TextStyle(
            fontFamily = Global.Fonts.Medium,
            fontSize = Global.FontSizes.Normal,
            color = Colors.BLACK
        )
    )

    if (!isValid) {
        Text(
            text = errorMessage
        )
    }

}