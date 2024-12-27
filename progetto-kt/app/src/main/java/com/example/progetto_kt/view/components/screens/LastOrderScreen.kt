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
import com.example.progetto_kt.viewmodel.MainViewModel
import com.mapbox.geojson.Point
import com.mapbox.maps.CameraOptions
import com.mapbox.maps.CoordinateBounds
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
import com.mapbox.maps.plugin.viewport.data.FollowPuckViewportStateOptions

@Composable
fun LastOrderScreen(
    viewModel: MainViewModel
) {

    val state by viewModel.uiState.collectAsState()
    val mapViewportState = rememberMapViewportState()

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


    // Define your three locations


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

        if (state.lastKnownLocation != null) {
            val location1 = Point.fromLngLat(
                state.lastKnownLocation!!.longitude,
                state.lastKnownLocation!!.latitude
            )
            val location2 = Point.fromLngLat(
                lastOrder.currentLocation.longitude,
                lastOrder.currentLocation.latitude
            )
            MapboxMap(
                modifier = Modifier.fillMaxSize(),
                mapViewportState = mapViewportState
            ) {
                val marker = rememberIconImage(
                    key = R.drawable.position_marker,
                    painter = painterResource(R.drawable.position_marker)
                )

                MapEffect(lastOrder) { mapView ->
                    mapView.location.updateSettings {
                        locationPuck = createDefault2DPuck(withBearing = true)
                        puckBearingEnabled = true
                        puckBearing = PuckBearing.HEADING
                        enabled = true
                    }


                    // Create a list of all locations
                    val allLocations = listOf(location1, location2)

                    // Calculate the camera options to include all locations
                    val cameraOptions = mapView.mapboxMap.cameraForCoordinates(
                        allLocations,
                        EdgeInsets(50.0, 50.0, 50.0, 50.0),
                        bearing = null,
                        pitch = null
                    )

                    // Center on location1 while keeping the calculated zoom
                    val finalCameraOptions = cameraOptions.toBuilder()
                        .center(location1)
                        .build()

                    // Set the camera
                    mapView.camera.easeTo(finalCameraOptions)

                }

                Log.d("LastOrderScreen", "Location1: $location1")
                Log.d("LastOrderScreen", "Location2: $location2")

                PointAnnotation(point = location2) {
                    iconImage = marker
                }
            }
        }

    }

}