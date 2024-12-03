package com.example.navigation_app.components.screens

import android.util.Log
import androidx.compose.foundation.Image
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.Button
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import com.example.navigation_app.R
import com.example.navigation_app.model.Menu

@Composable
fun MenuDetailsScreen(
    navController: NavController,
    menu: Menu,
    handleNavigateBack: () -> Unit) {


    Log.d("MenuDetailsScreen", "Stack: " + navController.backQueue.map {it.destination.route})

    Column (
        modifier = Modifier
            .fillMaxWidth()
            .padding(16.dp, 25.dp),
    ){

        Image(
            painter = painterResource(id = R.drawable.pizza),
            contentDescription = "Pizza Image",
            modifier = Modifier
                .size(120.dp)
        )

        Text(
            text = menu.title,
            modifier = Modifier
                .padding(0.dp, 0.dp, 0.dp, 8.dp),
            fontSize = 20.sp,
            fontWeight = FontWeight(700)
        )

        Text(
            text = menu.longDescription,
        )

        Button(onClick = {
            Log.d("MenuDetailsScreen", "Go Back pressed")
            handleNavigateBack()
        }) {
            Text(
                text = "Go Back"
            )
        }


    }

}