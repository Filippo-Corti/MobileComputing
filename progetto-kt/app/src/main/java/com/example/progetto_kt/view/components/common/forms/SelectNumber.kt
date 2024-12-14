package com.example.progetto_kt.view.components.common.forms

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.KeyboardArrowDown
import androidx.compose.material.icons.filled.KeyboardArrowUp
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.material3.TextField
import androidx.compose.material3.TextFieldDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.drawBehind
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.onGloballyPositioned
import androidx.compose.ui.unit.IntOffset
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.toSize
import androidx.compose.ui.window.Popup
import androidx.compose.ui.window.PopupProperties

@Composable
fun SelectNumber(
    min: Int,
    max : Int,
    value : String,
    label : String,
    onValueChange : (String) -> Boolean,
) {

    var textFieldSize by remember { mutableStateOf(Size.Zero) }
    var expanded by remember { mutableStateOf(false) }
    val icon = if (expanded)
        Icons.Filled.KeyboardArrowUp
    else
        Icons.Filled.KeyboardArrowDown

    Box(
        modifier = Modifier
            .padding(16.dp)
    ) {
        TextField(
            value = value,
            onValueChange = {
                onValueChange(it)
            },
            label = {
                Text(
                    text = label
                )
            },
            modifier = Modifier
                .fillMaxWidth()
                .onGloballyPositioned { coordinates ->
                    textFieldSize = coordinates.size.toSize()
                }
                .clickable { expanded = !expanded },
            trailingIcon = {
                Icon(icon,null)
            },
            enabled = false,
            colors = TextFieldDefaults.colors(
                disabledTextColor = Color.Black
            )
        )

        if (expanded) {
            Popup (
                alignment = Alignment.TopStart,
                offset = IntOffset(x = 0, y = textFieldSize.height.toInt()),
                onDismissRequest = { expanded = false },
                properties = PopupProperties(focusable = true)
            ) {
                Box(
                    modifier = Modifier
                        .width(150.dp)
                        .heightIn(max = 170.dp)
                        .border(width = 1.dp, color = Color.Gray)
                        .background(Color.White)
                ) {
                    LazyColumn(
                        modifier = Modifier
                            .fillMaxWidth()
                            .heightIn(max = 150.dp) // Limit height for scrollable items
                    ) {
                        items((min..max).toList()) { item ->
                            Box(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .clickable {
                                        onValueChange(item.toString())
                                        expanded = false
                                    }
                                    .drawBehind {
                                        val strokeWidth = 1.dp.toPx()
                                        drawLine(
                                            color = Color.Gray,
                                            start = Offset(0f, size.height),
                                            end = Offset(size.width, size.height),
                                            strokeWidth = strokeWidth
                                        )
                                    }
                                    .padding(15.dp)
                            ) {
                                Text(
                                    text = item.toString(),
                                    modifier = Modifier
                                        .align(Alignment.Center)
                                )
                            }
                        }
                    }
                }
            }
        }
    }


}