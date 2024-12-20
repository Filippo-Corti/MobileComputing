package com.example.progetto_kt.view.components.screens

import android.graphics.BitmapFactory
import android.util.Log
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
import com.example.progetto_kt.model.repositories.MenuRepository
import com.example.progetto_kt.viewmodel.MainViewModel
import kotlin.io.encoding.Base64
import kotlin.io.encoding.ExperimentalEncodingApi

@Composable
fun ConfirmOrderScreen(
    viewModel: MainViewModel,
    menuId : Int,
    onOrderClick : () -> Pair<Boolean, String>,
    onBackClick : () -> Unit
) {

    val TAG = MenuRepository::class.simpleName

    val menuDetails by viewModel.menuDetails.collectAsState()

    LaunchedEffect(menuId) {
        if (menuDetails == null)
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

            Text(
                text = "Confirm the Order",
                fontSize = 28.sp,
            )

            Button(
                onClick = {
                    val (ok, msg) = onOrderClick()
                    Log.d(TAG, "Order Result: $ok - $msg")
                },
                modifier = Modifier.padding(top = 16.dp)
            ) {
                Text(text = "Order")
            }

            Button(
                onClick = onBackClick,
                modifier = Modifier.padding(top = 16.dp)
            ) {
                Text(text = "Back")
            }
        }
    }

}