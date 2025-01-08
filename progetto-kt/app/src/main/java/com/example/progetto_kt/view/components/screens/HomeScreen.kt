package com.example.progetto_kt.view.components.screens

import android.graphics.BitmapFactory
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
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.lazy.rememberLazyListState
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Text
import androidx.compose.material3.pulltorefresh.PullToRefreshBox
import androidx.compose.material3.pulltorefresh.rememberPullToRefreshState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.asImageBitmap
import androidx.compose.ui.graphics.painter.BitmapPainter
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.progetto_kt.model.dataclasses.toPoint
import com.example.progetto_kt.view.styles.Colors
import com.example.progetto_kt.viewmodel.MainViewModel
import com.example.progetto_kt.viewmodel.util.CustomMarkerBuilder
import com.mapbox.maps.extension.compose.MapEffect
import com.mapbox.maps.extension.compose.MapboxMap
import com.mapbox.maps.extension.compose.animation.viewport.rememberMapViewportState
import com.mapbox.maps.extension.compose.annotation.generated.PointAnnotation
import com.mapbox.maps.extension.compose.annotation.rememberIconImage
import com.mapbox.maps.plugin.PuckBearing
import com.mapbox.maps.plugin.gestures.gestures
import com.mapbox.maps.plugin.locationcomponent.createDefault2DPuck
import com.mapbox.maps.plugin.locationcomponent.location
import com.mapbox.maps.plugin.viewport.data.FollowPuckViewportStateOptions
import kotlinx.coroutines.launch
import kotlin.io.encoding.Base64
import kotlin.io.encoding.ExperimentalEncodingApi


@Suppress("Deprecation")
@OptIn(ExperimentalEncodingApi::class, ExperimentalMaterial3Api::class)
@Composable
fun HomeScreen(
    viewModel: MainViewModel,
    onMenuClick: (Int) -> Unit
) {

    val appState by viewModel.appState.collectAsState()
    val locationState by viewModel.locationState.collectAsState()
    val menusState by viewModel.menusExplorationState.collectAsState()

    val listState = rememberLazyListState()
    var scrolledToId by remember { mutableIntStateOf(-1) }

    // Pull to Refresh
    val coroutineScope = rememberCoroutineScope()
    var isRefreshing by remember { mutableStateOf(false) }
    val refreshState = rememberPullToRefreshState()
    val onRefresh: () -> Unit = {
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


    PullToRefreshBox(
        isRefreshing = isRefreshing,
        state = refreshState,
        onRefresh = onRefresh
    ) {
        LazyColumn(
            modifier = Modifier
                .fillMaxWidth()
                .defaultMinSize(minHeight = 100.dp)
                .background(Colors.WHITE),
            verticalArrangement = Arrangement.spacedBy(8.dp),
            state = listState
        ) {

            item {
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
            }

            item {

                val userLocation = viewModel.getCurrentAPILocation().toPoint()
                val mapViewportState = rememberMapViewportState {
                    setCameraOptions {
                        center(userLocation)
                        zoom(11.0)
                    }
                }

//                MapboxMap(
//                    modifier = Modifier
//                        .fillMaxWidth()
//                        .height(250.dp),
//
//                    mapViewportState = mapViewportState,
//                ) {
//
//                    if (locationState.isLocationAllowed) {
//                        MapEffect(Unit) { mapView ->
//                            mapView.gestures.updateSettings {
//                                scrollEnabled = false
//                                pitchEnabled = false
//                                rotateEnabled = false
//                            }
//
//                            mapView.location.updateSettings {
//                                locationPuck = createDefault2DPuck(withBearing = true)
//                                puckBearingEnabled = true
//                                puckBearing = PuckBearing.HEADING
//                                enabled = true
//                            }
//                            mapViewportState.transitionToFollowPuckState(
//                                FollowPuckViewportStateOptions.Builder()
//                                    .zoom(11.0)
//                                    .pitch(0.0)
//                                    .build()
//                            )
//                        }
//                    }
//
//                    menusState.nearbyMenus.forEachIndexed { idx, menu ->
//                        if (menu.image != null) {
//                            val markerBitmap = CustomMarkerBuilder.getCustomMarker(
//                                context = LocalContext.current,
//                                menu = menu
//                            )
//
//                            val marker = rememberIconImage(
//                                key = menu.menu.id,
//                                painter = BitmapPainter(markerBitmap.asImageBitmap())
//                            )
//
//                            PointAnnotation(
//                                point = menu.menu.location.toPoint(),
//                                init = {
//                                    iconImage = marker
//                                    iconSize = 1.2
//                                },
//                                onClick = {
//                                    coroutineScope.launch {
//                                        scrolledToId = menu.menu.id
//                                        listState.animateScrollToItem(idx + 2, -250)
//                                    }
//                                    true
//                                }
//                            )
//                        }
//                    }
//
//                }
            }

            items(menusState.nearbyMenus) { menu ->

                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(16.dp)
                        .clickable {
                            scrolledToId = menu.menu.id
                            onMenuClick(menu.menu.id)
                        }
                        .background(if (menu.menu.id == scrolledToId) Color.LightGray else Color.Transparent),
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(12.dp)
                    ) {

                        if (menu.image != null) {
                            val byteArray = Base64.decode(menu.image.raw)
                            val bitmap =
                                BitmapFactory.decodeByteArray(byteArray, 0, byteArray.size)

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