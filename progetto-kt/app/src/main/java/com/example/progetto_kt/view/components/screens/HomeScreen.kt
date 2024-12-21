package com.example.progetto_kt.view.components.screens

import android.util.Log
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.progetto_kt.viewmodel.MainViewModel

@Composable
fun HomeScreen(
    viewModel: MainViewModel,
    onMenuClick: (Int) -> Unit
) {

    val state by viewModel.uiState.collectAsState()

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
        LazyColumn(
            modifier = Modifier.fillMaxWidth(),
            verticalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            items(state.nearbyMenus) { menu ->
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(16.dp)
                        .clickable { onMenuClick(menu.id) },
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Text(text = menu.name)
                    Text(text = "${menu.price.toString()} €")
                }
            }
        }
    }
}