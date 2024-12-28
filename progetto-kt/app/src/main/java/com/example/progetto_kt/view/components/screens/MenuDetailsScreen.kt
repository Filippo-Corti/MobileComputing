package com.example.progetto_kt.view.components.screens

import android.graphics.BitmapFactory
import androidx.compose.foundation.Image
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
    onForwardClick : (Int) -> Unit,
    onBackClick : () -> Unit
) {

    val appState by viewModel.appState.collectAsState()
    val menusState by viewModel.menusExplorationState.collectAsState()

    LaunchedEffect(menuId) {
        viewModel.fetchMenuDetails(menuId)
    }

    if (appState.isLoading || menusState.selectedMenu == null || menusState.selectedMenu?.menuDetails?.id != menuId) {
        return Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(16.dp),
            verticalArrangement = Arrangement.Center,
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            CircularProgressIndicator()
        }
    }

    val menuDetails = menusState.selectedMenu!!.menuDetails
    val byteArray = Base64.decode(menusState.selectedMenu!!.image.raw)
    val bitmap = BitmapFactory.decodeByteArray(byteArray, 0, byteArray.size)

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp)
    ) {
        Text(
            text = menuDetails.name,
            fontSize = 24.sp,
        )
        Text(
            text = menuDetails.longDescription,
            modifier = Modifier.padding(top = 8.dp)
        )
        Text(
            text = menuDetails.location.address ?: "",
            modifier = Modifier.padding(top = 8.dp)
        )

        Image(
            bitmap = bitmap.asImageBitmap(),
            contentDescription = menuDetails.name,
            modifier = Modifier.padding(top = 16.dp)
        )

        Button(
            onClick = { onForwardClick(menuId) },
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