package com.example.progetto_kt.view.components.screens

import android.util.Log
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
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
import androidx.compose.ui.text.buildAnnotatedString
import androidx.compose.ui.unit.dp
import androidx.lifecycle.Lifecycle
import androidx.lifecycle.compose.LocalLifecycleOwner
import androidx.lifecycle.repeatOnLifecycle
import com.example.progetto_kt.R
import com.example.progetto_kt.model.dataclasses.MenuDetailsWithImage
import com.example.progetto_kt.model.dataclasses.Order
import com.example.progetto_kt.model.dataclasses.OrderStatus
import com.example.progetto_kt.model.dataclasses.Timestamps.formatTimestamp
import com.example.progetto_kt.model.dataclasses.Timestamps.toMillis
import com.example.progetto_kt.model.dataclasses.toPoint
import com.example.progetto_kt.view.components.common.buttons.ButtonWithArrow
import com.example.progetto_kt.view.components.common.icons.IconNames
import com.example.progetto_kt.view.components.common.other.InfoTextBox
import com.example.progetto_kt.view.components.common.other.MenuSmallPreview
import com.example.progetto_kt.view.components.common.other.ProgressBar
import com.example.progetto_kt.view.components.common.other.Separator
import com.example.progetto_kt.view.styles.Colors
import com.example.progetto_kt.view.styles.Global
import com.example.progetto_kt.viewmodel.LocationState
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
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

@Composable
fun LastOrderScreen(
    viewModel: MainViewModel,
    onExploreMenusClick: () -> Unit
) {

    val appState by viewModel.appState.collectAsState()
    val userState by viewModel.userState.collectAsState()
    val orderState by viewModel.lastOrderState.collectAsState()
    val locationState by viewModel.locationState.collectAsState()

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
        return Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
            CircularProgressIndicator(color = Colors.PRIMARY)
        }
    }

    val lastOrder = orderState.lastOrder
    val lastOrderedMenu = orderState.lastOrderMenu

    if (!userState.isUserRegistered || userState.user == null || userState.user?.lastOrderId == null
        || lastOrder == null || lastOrderedMenu == null
    ) {
        return Box(
            modifier = Global.Container
                .fillMaxHeight()
        ) {
            NoOrderState {
                onExploreMenusClick()
            }
        }
    }

    Box(
        modifier = Global.Container
            .fillMaxHeight()
    ) {
        ShowOrderState(
            order = lastOrder,
            menu = lastOrderedMenu,
            locationData = locationState
        )
    }

}

@Composable
fun NoOrderState(
    onPress: () -> Unit
) {
    Column(
        modifier = Global.InsetContainer
            .padding(top = 20.dp)
    ) {

        Text(
            text = "This is where your order will appear after you placed it.\n" +
                    "You’ll be able to check how far it is from you and how long it " +
                    "will take the drone to deliver it. \n\n" +
                    "Right now you haven’t placed your first order yet. Go check some menus in the home page!",
            color = Colors.BLACK,
            fontSize = Global.FontSizes.Normal,
            fontFamily = Global.Fonts.Regular,
            modifier = Modifier.padding(horizontal = 5.dp)
        )

        Box(
            modifier = Modifier.fillMaxWidth(),
            contentAlignment = Alignment.CenterEnd
        ) {
            ButtonWithArrow(
                text = "Explore menus",
                onPress = onPress
            )
        }

    }
}


@Composable
fun Header(
    order: Order
) {
    val now = System.currentTimeMillis()
    val creationTime = order.creationTimestamp.toMillis()
    val expectedDeliveryTime = order.expectedDeliveryTimestamp?.toMillis()
    val deliveryTime = order.deliveryTimestamp?.toMillis()
    val completed = order.status == OrderStatus.COMPLETED
    val totalTime = expectedDeliveryTime?.minus(creationTime)
    val elapsedTime = now - creationTime

    val progress = if (completed) 100F else (elapsedTime.toFloat() / (totalTime!!.toFloat())) * 100
    val minutesAway =
        (((if (completed) deliveryTime else expectedDeliveryTime)!! - now) / 60000).toInt()

    Box(
        modifier = Global.InsetContainer
            .padding(horizontal = 10.dp, vertical = 22.dp)
    ) {
        Column(modifier = Modifier.fillMaxWidth()) {
            Text(
                text = if (completed) "Your order has arrived!" else "Almost there...",
                color = Colors.BLACK,
                fontSize = Global.FontSizes.Title,
                fontFamily = Global.Fonts.Medium
            )

            Spacer(modifier = Modifier.height(10.dp))

            Row {
                Text(
                    text = buildAnnotatedString {
                        append(
                            if (completed) {
                                "Arrived at " + order.deliveryTimestamp?.formatTimestamp()
                            } else {
                                "Arriving at " + order.expectedDeliveryTimestamp?.formatTimestamp()
                            }
                        )
                    },
                    color = Colors.BLACK,
                    fontSize = Global.FontSizes.Normal,
                    fontFamily = Global.Fonts.Medium
                )

                Text(
                    text = buildAnnotatedString {
                        append("  (")
                        append(
                            if (completed) {
                                "${-minutesAway} minutes ago"
                            } else {
                                "${minutesAway + 1} minutes away"
                            }
                        )
                        append(")")
                    },
                    color = Colors.BLACK,
                    fontSize = Global.FontSizes.Normal,
                    fontFamily = Global.Fonts.Regular
                )
            }


            Spacer(modifier = Modifier.height(10.dp))

            ProgressBar(progress = progress.toInt())
        }
    }
}

@Composable
fun ShowOrderState(
    order: Order,
    menu: MenuDetailsWithImage,
    locationData: LocationState
) {

    val price = "%.2f".format(menu.menuDetails.price)

    val showMap = locationData.isLocationAllowed && locationData.lastKnownLocation != null

    val userLocation = locationData.lastKnownLocation!!.toPoint()
    val droneLocation = order.currentLocation.toPoint()
    val deliveryLocation = order.deliveryLocation.toPoint()
    val menuLocation = menu.menuDetails.location.toPoint()

    val mapViewportState = rememberMapViewportState {
        setCameraOptions {
            center(userLocation)
            zoom(17.0)
        }
    }

    Column {

        Header(
            order = order
        )

        if (showMap) {
            MapboxMap(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(220.dp),
                mapViewportState = mapViewportState,
            ) {
                val droneMarker = rememberIconImage(
                    key = R.drawable.drone,
                    painter = painterResource(R.drawable.drone)
                )

                val deliveryMarker = rememberIconImage(
                    key = R.drawable.home_marker,
                    painter = painterResource(R.drawable.home_marker)
                )

                val menuMarker = rememberIconImage(
                    key = R.drawable.menu_marker,
                    painter = painterResource(R.drawable.menu_marker)
                )


                PointAnnotation(point = deliveryLocation) {
                    iconImage = deliveryMarker
                    iconSize = 0.25

                }

                PointAnnotation(point = menuLocation) {
                    iconImage = menuMarker
                    iconSize = 0.25
                }

                if (order.status == OrderStatus.ON_DELIVERY)
                    PointAnnotation(point = droneLocation) {
                        iconImage = droneMarker
                        iconSize = 0.1
                    }

                MapEffect(order) { mapView ->
                    // Show the user location
                    mapView.location.updateSettings {
                        locationPuck = createDefault2DPuck(withBearing = true)
                        puckBearingEnabled = true
                        puckBearing = PuckBearing.HEADING
                        enabled = true
                    }

                    // Calculate the camera options to include all locations
                    mapView.mapboxMap.cameraForCoordinates(
                        coordinates = listOf(
                            userLocation,
                            droneLocation,
                            deliveryLocation,
                            menuLocation
                        ),
                        camera = CameraOptions.Builder().build(),
                        coordinatesPadding = EdgeInsets(100.0, 100.0, 100.0, 100.0),
                        maxZoom = 17.0,
                        offset = null,
                    ) { cameraOptions ->

                        // Set the camera
                        mapView.camera.easeTo(
                            cameraOptions
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

            Text(
                text = "Delivery details",
                color = Colors.BLACK,
                fontSize = Global.FontSizes.Subtitle,
                fontFamily = Global.Fonts.Medium,
                modifier = Modifier.padding(bottom = 5.dp, start = 30.dp, end = 20.dp, top = 25.dp)
            )

            if (order.deliveryLocation.address != null) {
                InfoTextBox(
                    label = "Pick it up at",
                    text = order.deliveryLocation.address!!
                )
            }

            if (order.currentLocation.address != null) {
                InfoTextBox(
                    label = "Drone is currently at",
                    text = order.currentLocation.address!!
                )
            }

        }

        Separator(color = Colors.LIGHT_GRAY, size = 10)

        Text(
            text = "Order details",
            color = Colors.BLACK,
            fontSize = Global.FontSizes.Subtitle,
            fontFamily = Global.Fonts.Medium,
            modifier = Modifier.padding(bottom = 0.dp, start = 30.dp, end = 20.dp, top = 25.dp)
        )

        MenuSmallPreview(
            title = "1x ${menu.menuDetails.name}",
            price = price,
            image = menu.image.raw
        )

    }

}