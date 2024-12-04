package com.example.navigation_app.components.screens

import android.util.Log
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.KeyboardArrowDown
import androidx.compose.material.icons.filled.KeyboardArrowUp
import androidx.compose.material3.Button
import androidx.compose.material3.DropdownMenu
import androidx.compose.material3.DropdownMenuItem
import androidx.compose.material3.Icon
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.material3.TextField
import androidx.compose.material3.TextFieldDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.drawBehind
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.onGloballyPositioned
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.IntOffset
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.unit.toSize
import androidx.compose.ui.window.Popup
import androidx.compose.ui.window.PopupProperties
import com.example.navigation_app.R
import com.example.navigation_app.model.User

@Composable
fun EditAccountScreen(handleNavigateBack : () -> Unit) {


    val validateName: (String) -> Boolean = { name ->
        name.isNotEmpty() && name.length >= 3 && name.length <= 15
    }

    var name by remember { mutableStateOf("") }
    var isValidName by remember { mutableStateOf(validateName(name)) }


    var mExpanded by remember { mutableStateOf(false) }
    var mSelectedValue by remember { mutableStateOf("0") }
    val icon = if (mExpanded)
        Icons.Filled.KeyboardArrowUp
    else
        Icons.Filled.KeyboardArrowDown

    Column (
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        verticalArrangement = Arrangement.Top,
        horizontalAlignment = Alignment.CenterHorizontally,
    ) {
        Text(
            text = "This is the Edit Account Screen",
            fontSize = 20.sp
        )

        OutlinedTextField(
            value = name,
            onValueChange = {
                name = it
                isValidName = validateName(it)
            },
            label = { Text("Name") },
            isError = !isValidName,
            singleLine = true,
            keyboardOptions = KeyboardOptions(
                keyboardType = KeyboardType.Text
            )
        )

        var textFieldSize by remember { mutableStateOf(androidx.compose.ui.geometry.Size.Zero) }

        Box(modifier = Modifier.padding(16.dp)) {
            // TextField to display selected value
            TextField(
                value = mSelectedValue,
                onValueChange = { mSelectedValue = it },
                modifier = Modifier
                    .fillMaxWidth()
                    .onGloballyPositioned { coordinates ->
                        textFieldSize = coordinates.size.toSize()
                    }
                    .clickable { mExpanded = !mExpanded },
                trailingIcon = {
                    Icon(icon,null)
                },
                enabled = false,
                colors = TextFieldDefaults.colors(
                    disabledTextColor = Color.Black
                )
            )

            // Popup for Dropdown
            if (mExpanded) {
                Popup(
                    alignment = Alignment.TopStart,
                    offset = IntOffset(x = 0, y = textFieldSize.height.toInt()),
                    onDismissRequest = { mExpanded = false },
                    properties = PopupProperties(focusable = true)
                ) {
                    Box(
                        modifier = Modifier
                            .width(150.dp) // Match TextField width
                            .heightIn(max = 170.dp)       // Limit height for scrollable items
                            .border(width = 1.dp, color = androidx.compose.ui.graphics.Color.Gray) // Add border
                            .background(androidx.compose.ui.graphics.Color.White) // Add background color
                    ) {
                        LazyColumn(
                            modifier = Modifier
                                .fillMaxWidth()
                                .heightIn(max = 150.dp) // Limit height for scrollable items
                        ) {
                            items((0..10).toList()) { item ->
                                Box(
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .clickable {
                                            mSelectedValue = item.toString()
                                            mExpanded = false
                                        }
                                        .drawBehind {
                                            val strokeWidth = 1.dp.toPx()
                                            drawLine(
                                                color = androidx.compose.ui.graphics.Color.Gray,
                                                start = Offset(0f, size.height), // Start at the bottom-left
                                                end = Offset(size.width, size.height), // End at the bottom-right
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

        Button(onClick = {
            if (isValidName) {
                Log.d("EditAccountScreen", "VALID FORM: Name: $name, Selected Value: $mSelectedValue")
            } else {
                Log.d("EditAccountScreen", "INVALID FORM")
            }
        }) {
            Text("Submit")
        }

        Button(onClick = handleNavigateBack) {
            Text("Go Back")
        }

    }
}