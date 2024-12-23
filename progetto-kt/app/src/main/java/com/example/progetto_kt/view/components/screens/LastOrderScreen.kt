package com.example.progetto_kt.view.components.screens

import android.util.Log
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.DisposableEffect
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.rememberUpdatedState
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.lifecycle.Lifecycle
import androidx.lifecycle.compose.LocalLifecycleOwner
import androidx.lifecycle.repeatOnLifecycle
import com.example.progetto_kt.viewmodel.MainViewModel

@Composable
fun LastOrderScreen(
    viewModel: MainViewModel
) {

    val state by viewModel.uiState.collectAsState()

    val lifecycleOwner = LocalLifecycleOwner.current

    LaunchedEffect(lifecycleOwner) {
        lifecycleOwner.lifecycle.repeatOnLifecycle(Lifecycle.State.STARTED) {
            while (true) {
                viewModel.fetchLastOrderDetails()
                kotlinx.coroutines.delay(5000)
            }
        }
    }

    if (state.isLoading) {
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

    if (state.user == null) {
        return Column {
            Text(
                text = "Not Registered",
            )
        }
    }

    val lastOrder = state.lastOrder
    val lastOrderedMenu = state.lastOrderMenu

    if (lastOrder == null || lastOrderedMenu == null) {
        return Column {
            Text(
                text = "No Orders yet",
            )
        }
    }

    return Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp)
    ) {
        Text(
            text = "Last Order",
        )

        Text(
            text = "STATUS: ${lastOrder.status}",
        )

        Text(
            text = "The Order was a : ${lastOrderedMenu.name}",
        )

        Text(
            text = "Current Location: ${lastOrder.currentLocation}",
        )

        Text(
            text = "Arrived at: ${lastOrder.deliveryTimestamp}",
        )

        Text(
            text = "Arriving at: ${lastOrder.expectedDeliveryTimestamp}",
        )
    }



}