package com.example.progetto_kt.view.components.screens

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.Button
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.example.progetto_kt.model.dataclasses.OrderStatus
import com.example.progetto_kt.viewmodel.MainViewModel

@Composable
fun AccountScreen(
    viewModel : MainViewModel,
    onEditAccountClick : (Boolean) -> Unit,
    onOrderAgainClick : (Int) -> Unit,
    onCheckLastOrderClick : () -> Unit,
) {

    val state by viewModel.uiState.collectAsState()

    LaunchedEffect(Unit) {
        viewModel.fetchLastOrderDetails()
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

    val user = state.user
    val lastOrderMenu = state.lastOrderMenu

    if (user == null) {
        return Column {
            Text(
                text = "Not Registered",
            )

            Button(
                onClick = { onEditAccountClick(true) }
            ) {
                Text(
                    text = "Register"
                )
            }

        }
    }


    Column (
           modifier = Modifier.fillMaxWidth(),
           verticalArrangement = Arrangement.spacedBy(8.dp)
       ){

        Text(
            text = "Registered User",
        )

        Text(
            text = "${user.firstName} ${user.lastName}",
        )

        Text(
            text = "Last Ordered ${user.lastOrderId} - ${user.orderStatus}",
        )

        if (lastOrderMenu != null) {
            Text(
                text = "Last Order was a ${lastOrderMenu.name}",
            )

            if (user.orderStatus == OrderStatus.ON_DELIVERY) {
                Button(
                    onClick = onCheckLastOrderClick
                ) {
                    Text(
                        text = "Check Last Order"
                    )
                }
            } else {
                Button(
                    onClick = { onOrderAgainClick(lastOrderMenu.id) }
                ) {
                    Text(
                        text = "order Again"
                    )
                }
            }

        }

        Button(
            onClick = { onEditAccountClick(false) }
        ) {
            Text(
                text = "Edit Account"
            )
        }

    }


}