package com.example.progetto_kt.view.components.common.forms

import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material3.Text
import androidx.compose.material3.TextField
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue

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
                text = label
            )
        },
        singleLine = true,
        isError = !isValid,
        keyboardOptions = keyBoardOptions
    )

    if (!isValid) {
        Text(
            text = errorMessage
        )
    }

}