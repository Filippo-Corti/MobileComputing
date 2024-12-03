package com.example.navigation_app.components.screens

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.navigation_app.model.Menu

@Composable
fun HomeScreen() {

    val menus by remember { mutableStateOf(createSampleMenus()) }

    Column {

        Text(
            text = "Menus around you",
            modifier = Modifier
                .padding(16.dp, 25.dp)
                .fillMaxWidth(),
            fontSize = 25.sp,
            fontWeight = FontWeight(700),
            textAlign = TextAlign.Center,
        )

        LazyColumn (
            modifier = Modifier
                .fillMaxWidth(),
            verticalArrangement = Arrangement.spacedBy(8.dp)

        ){
            items(menus) {
                MenuPreview(it)
            }
        }
    }

}

fun createSampleMenus() : List<Menu> {
    return listOf(
        Menu("Pizza", "Una buona pizza margherita con pomodoro, mozzarella"),
        Menu("Pasta", "Una pasta alla carbonara che dalla foto sembra una pizza"),
    )
}