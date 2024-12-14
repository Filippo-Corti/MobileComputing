package com.example.progetto_kt.view.components.screens

import android.graphics.BitmapFactory
import androidx.compose.foundation.Image
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
import androidx.compose.ui.graphics.asImageBitmap
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.progetto_kt.viewmodel.MainViewModel
import kotlin.io.encoding.Base64
import kotlin.io.encoding.ExperimentalEncodingApi

@OptIn(ExperimentalEncodingApi::class)
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
        val byteArray = Base64.decode(menuDetails!!.image.image)
        val bitmap = BitmapFactory.decodeByteArray(byteArray, 0, byteArray.size)

        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(16.dp)
        ) {
            Text(
                text = menuDetails!!.menuDetails.name,
                fontSize = 24.sp,
            )
            Text(
                text = menuDetails!!.menuDetails.longDescription,
                modifier = Modifier.padding(top = 8.dp)
            )

            Image(
                bitmap = bitmap.asImageBitmap(),
                contentDescription = menuDetails!!.menuDetails.name,
                modifier = Modifier.padding(top = 16.dp)
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