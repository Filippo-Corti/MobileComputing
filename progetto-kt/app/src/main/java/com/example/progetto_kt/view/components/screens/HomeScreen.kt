package com.example.progetto_kt.view.components.screens

import android.graphics.BitmapFactory
import android.util.Log
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.defaultMinSize
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Text
import androidx.compose.material3.pulltorefresh.PullToRefreshBox
import androidx.compose.material3.pulltorefresh.rememberPullToRefreshState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.asImageBitmap
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.progetto_kt.viewmodel.MainViewModel
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.launch
import kotlin.io.encoding.Base64
import kotlin.io.encoding.ExperimentalEncodingApi

@OptIn(ExperimentalEncodingApi::class, ExperimentalMaterial3Api::class)
@Composable
fun HomeScreen(
    viewModel: MainViewModel,
    onMenuClick: (Int) -> Unit
) {

    val appState by viewModel.appState.collectAsState()
    val locationState by viewModel.locationState.collectAsState()
    val menusState by viewModel.menusExplorationState.collectAsState()

    // Pull to Refresh
    var isRefreshing by remember { mutableStateOf(false) }
    val refreshState = rememberPullToRefreshState()
    val coroutineScope = rememberCoroutineScope()
    val onRefresh : () -> Unit = {
        isRefreshing = true
        viewModel.fetchNearbyMenusAsync {
            isRefreshing = false
        }
    }

    LaunchedEffect(menusState.reloadMenus) {
        if (menusState.nearbyMenus.isEmpty() && !appState.isLoading || menusState.reloadMenus) {
            isRefreshing = true
            viewModel.fetchNearbyMenusAsync {
                isRefreshing = false
            }
        }
    }

    if (appState.isLoading) {
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
        if (locationState.isLocationAllowed) {
            Text(
                text = "Location is allowed - Showing menus in ${locationState.lastKnownLocation?.address}",
                modifier = Modifier
                    .padding(16.dp, 25.dp)
                    .fillMaxWidth(),
            )
        } else {
            Text(
                text = "Location is not allowed - Showing menus around Milan",
                modifier = Modifier
                    .padding(16.dp, 25.dp)
                    .fillMaxWidth(),
            )
        }

        PullToRefreshBox(
            isRefreshing = isRefreshing,
            state = refreshState,
            onRefresh = onRefresh
        ) {
            LazyColumn(
                modifier = Modifier
                    .fillMaxWidth()
                    .defaultMinSize(minHeight = 100.dp),
                verticalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                items(menusState.nearbyMenus) { menu ->

                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(16.dp)
                            .clickable { onMenuClick(menu.menu.id) },
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(12.dp)
                        ) {

                            if (menu.image != null) {
                                val byteArray = Base64.decode(menu.image.raw)
                                val bitmap = BitmapFactory.decodeByteArray(byteArray, 0, byteArray.size)

                                Image(
                                    bitmap = bitmap.asImageBitmap(),
                                    contentDescription = menu.menu.name,
                                    modifier = Modifier.size(70.dp, 70.dp)
                                )
                            } else {
                                Box(
                                    modifier = Modifier
                                        .size(70.dp, 70.dp)
                                        .background(color = Color.Gray)
                                )
                            }
                            Text(text = menu.menu.name)
                        }
                        Text(text = "${menu.menu.price} €")
                    }
                }
            }
        }

    }
}