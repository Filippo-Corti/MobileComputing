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
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.example.progetto_kt.viewmodel.MainViewModel

@Composable
fun AccountScreen(
    viewModel : MainViewModel,
    onEditAccountClick : (Boolean) -> Unit
) {

    val user by viewModel.userWithOrder.collectAsState()
    val isLoading by viewModel.isLoading.collectAsState()


    if (isLoading) {
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

    if (user.user == null) {
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
            text = "${user.user?.firstName} ${user.user?.lastName}",
        )

        Text(
            text = "Last Ordered ${user.user?.lastOrderId} - ${user.user?.orderStatus}",
        )

        if (user.lastOrder != null) {
            Text(
                text = "Last Order was a ${user.lastOrder?.menuId}",
            )
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