package com.example.progetto_kt.view.components.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Button
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.progetto_kt.viewmodel.MainViewModel

@Composable
fun MenuDetailsScreen(
    viewModel: MainViewModel,
    menuId : Int,
    onBackClick : () -> Unit
) {

    val menuDetails by viewModel.menuDetails.collectAsState()

    LaunchedEffect(menuId) {
        viewModel.fetchMenuDetails(menuId)
    }

    if (menuDetails == null) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(16.dp),
            verticalArrangement = Arrangement.Center,
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            CircularProgressIndicator()
        }
    } else {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .background(color = Color.White)
                .padding(16.dp)
        ) {
            Text(
                text = menuDetails!!.name,
                fontSize = 24.sp,
            )
            Text(
                text = menuDetails!!.longDescription,
                modifier = Modifier.padding(top = 8.dp)
            )

            Button(
                onClick = onBackClick,
                modifier = Modifier.padding(top = 16.dp)
            ) {
                Text(text = "Back")
            }
        }
    }

}