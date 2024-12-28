package com.example.progetto_kt.view.components.screens

import android.util.Log
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.unit.dp
import androidx.lifecycle.Lifecycle
import androidx.lifecycle.compose.LocalLifecycleOwner
import androidx.lifecycle.repeatOnLifecycle
import com.example.progetto_kt.R
import com.example.progetto_kt.model.dataclasses.toPoint
import com.example.progetto_kt.viewmodel.MainViewModel
import com.mapbox.geojson.Point
import com.mapbox.maps.CameraOptions
import com.mapbox.maps.EdgeInsets
import com.mapbox.maps.extension.compose.MapEffect
import com.mapbox.maps.extension.compose.MapboxMap
import com.mapbox.maps.extension.compose.animation.viewport.rememberMapViewportState
import com.mapbox.maps.extension.compose.annotation.generated.PointAnnotation
import com.mapbox.maps.extension.compose.annotation.rememberIconImage
import com.mapbox.maps.plugin.PuckBearing
import com.mapbox.maps.plugin.animation.camera
import com.mapbox.maps.plugin.locationcomponent.createDefault2DPuck
import com.mapbox.maps.plugin.locationcomponent.location

@Composable
fun LastOrderScreen(
    viewModel: MainViewModel
) {

    val appState by viewModel.appState.collectAsState()
    val userState by viewModel.userState.collectAsState()
    val orderState by viewModel.lastOrderState.collectAsState()
    val locationState by viewModel.locationState.collectAsState()
    val showMap = locationState.lastKnownLocation != null

    val lifecycleOwner = LocalLifecycleOwner.current

    LaunchedEffect(lifecycleOwner) {
        lifecycleOwner.lifecycle.repeatOnLifecycle(Lifecycle.State.STARTED) {
            while (true) {
                viewModel.fetchLastOrderDetails()
                kotlinx.coroutines.delay(5000)
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

    if (!userState.isUserRegistered) {
        return Column {
            Text(
                text = "Not Registered",
            )
        }
    }

    val lastOrder = orderState.lastOrder
    val lastOrderedMenu = orderState.lastOrderMenu

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

        if (showMap) {
            val userLocation = locationState.lastKnownLocation!!.toPoint()
            val droneLocation = lastOrder.currentLocation.toPoint()
            val deliveryLocation = lastOrder.deliveryLocation.toPoint()

            val mapViewportState = rememberMapViewportState {
                setCameraOptions {
                    center(userLocation)
                    zoom(17.0)
                }
            }

            MapboxMap(
                modifier = Modifier.fillMaxSize(),
                mapViewportState = mapViewportState
            ) {
                val marker = rememberIconImage(
                    key = R.drawable.position_marker,
                    painter = painterResource(R.drawable.position_marker)
                )

                PointAnnotation(point = droneLocation) { iconImage = marker }
                PointAnnotation(point = deliveryLocation) { iconImage = marker }

                MapEffect(lastOrder) { mapView ->
                    // Show the user location
                    mapView.location.updateSettings {
                        locationPuck = createDefault2DPuck(withBearing = true)
                        puckBearingEnabled = true
                        puckBearing = PuckBearing.HEADING
                        enabled = true
                    }

                    // Calculate the camera options to include all locations
                    mapView.mapboxMap.cameraForCoordinates(
                        coordinates = listOf(userLocation, droneLocation, deliveryLocation),
                        camera = CameraOptions.Builder().build(),
                        coordinatesPadding = EdgeInsets(100.0, 100.0, 100.0, 100.0),
                        maxZoom = 17.0,
                        offset = null,
                    ) { cameraOptions ->


                        // Set the camera
                        mapView.camera.easeTo(cameraOptions
                            .toBuilder()
                            .zoom(
                                if (cameraOptions.zoom != null)
                                    cameraOptions.zoom!!.toInt().toDouble()
                                else
                                    17.0
                            )
                            .build()
                        )
                    }

                }

            }
        }

    }

}