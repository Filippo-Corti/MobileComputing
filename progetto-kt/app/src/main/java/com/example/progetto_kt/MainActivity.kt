package com.example.progetto_kt

import android.content.Context
import android.os.Bundle
import android.Manifest
import android.location.Geocoder
import android.util.Log
import androidx.activity.ComponentActivity
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.activity.result.contract.ActivityResultContracts
import androidx.activity.viewModels
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import androidx.datastore.preferences.preferencesDataStore
import androidx.lifecycle.viewmodel.initializer
import androidx.lifecycle.viewmodel.viewModelFactory
import com.example.progetto_kt.model.dataclasses.Error
import com.example.progetto_kt.model.dataclasses.ErrorType
import com.example.progetto_kt.model.datasources.PreferencesController
import com.example.progetto_kt.model.datasources.APIController
import com.example.progetto_kt.model.datasources.DBController
import com.example.progetto_kt.model.repositories.MenuRepository
import com.example.progetto_kt.model.repositories.UserRepository
import com.example.progetto_kt.view.navigation.RootNavHost
import com.example.progetto_kt.viewmodel.MainViewModel
import com.example.rprogetto_kt.model.repositories.OrderRepository
import com.google.android.gms.location.LocationCallback
import com.google.android.gms.location.LocationServices
import java.util.Locale

class MainActivity : ComponentActivity() {

    private val Context.dataStore by preferencesDataStore(name = "appStatus")

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        val apiController = APIController()
        val dbController = DBController(this)
        val preferencesController = PreferencesController.getInstance(dataStore)

        val userRepository = UserRepository(
            apiController = apiController,
            dbController = dbController,
            preferencesController = preferencesController
        )

        val menuRepository = MenuRepository(
            apiController = apiController,
            dbController = dbController,
            preferencesController = preferencesController
        )

        val orderRepository = OrderRepository(
            apiController = apiController,
            dbController = dbController,
            preferencesController = preferencesController
        )

        val geocoder = Geocoder(this, Locale.getDefault())

        val fusedLocationClient = LocationServices.getFusedLocationProviderClient(this)

        val viewModelFactory = viewModelFactory {
            initializer {
                MainViewModel(
                    userRepository = userRepository,
                    menuRepository = menuRepository,
                    orderRepository = orderRepository,
                    geocoder = geocoder,
                    locationClient = fusedLocationClient
                )
            }
        }
        val viewModel by viewModels<MainViewModel> { viewModelFactory }

        enableEdgeToEdge()
        setContent {
            MangiaEBasta(viewModel)
        }

    }
}


@Composable
fun MangiaEBasta(
    viewModel: MainViewModel
) {

    val TAG = "MangiaEBasta"

    val appState by viewModel.appState.collectAsState()
    val locationState by viewModel.locationState.collectAsState()

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

    val context = LocalContext.current

    val locationCallback = remember {
        object : LocationCallback() {
            override fun onLocationResult(locationResult: com.google.android.gms.location.LocationResult) {
                super.onLocationResult(locationResult)
                val location = locationResult.lastLocation
                if (location != null) {
                    Log.d(TAG, "Saved new Location $location")
                    viewModel.allowLocation(location)
                }
            }

            override fun onLocationAvailability(availability: com.google.android.gms.location.LocationAvailability) {
                super.onLocationAvailability(availability)
                if (!availability.isLocationAvailable) {
                    Log.w(TAG, "Location not available")
                }
            }
        }
    }

    val permissionLauncher = rememberLauncherForActivityResult(
        ActivityResultContracts.RequestPermission()
    ) { isGranted ->
        Log.d(TAG, "Location Permission: $isGranted!")
        if (isGranted) {
            viewModel.getCurrentLocation() // Get first location immediately
            viewModel.subscribeToLocationUpdates(locationCallback)
        } else {
            viewModel.disallowLocation()
        }
    }

    LaunchedEffect(locationState.hasCheckedPermissions) {
        if (locationState.hasCheckedPermissions) return@LaunchedEffect

        viewModel.setLoading(true)
        if (viewModel.checkLocationPermission(context)) {
            viewModel.getCurrentLocation() // Get first location immediately
            viewModel.subscribeToLocationUpdates(locationCallback)
        } else {
            viewModel.setError(
                Error(
                    type = ErrorType.POSITION_UNALLOWED,
                    title = "We need your Location",
                    message = "This app requires your location to work properly. \nIn case you deny the permission, some features may not work as expected.",
                    actionText = "I'll do it"
                )
            )
            viewModel.setLoading(false)
            viewModel.disallowLocation()
        }

        viewModel.setCheckedPermissions(true)
    }

    Log.d("MainActivity", "Loaded!")

    RootNavHost(
        viewModel = viewModel,
        onAskLocationPermission = {
            permissionLauncher.launch(Manifest.permission.ACCESS_FINE_LOCATION)
        }
    )

}
