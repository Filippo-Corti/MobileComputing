package com.example.progetto_kt

import android.content.Context
import android.content.pm.PackageManager
import android.os.Bundle
import android.Manifest
import android.annotation.SuppressLint
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
import androidx.core.content.ContextCompat
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
import com.google.android.gms.location.FusedLocationProviderClient
import com.google.android.gms.location.LocationCallback
import com.google.android.gms.location.LocationRequest
import com.google.android.gms.location.LocationServices
import com.google.android.gms.location.Priority
import com.google.android.gms.tasks.CancellationTokenSource
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.tasks.await
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

        val viewModelFactory = viewModelFactory {
            initializer {
                MainViewModel(
                    userRepository,
                    menuRepository,
                    orderRepository,
                    geocoder
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

fun checkLocationPermission(context: Context): Boolean {
    return ContextCompat.checkSelfPermission(
        context,
        Manifest.permission.ACCESS_FINE_LOCATION
    ) == PackageManager.PERMISSION_GRANTED;
}

@SuppressLint("MissingPermission")
fun getCurrentLocation(fusedLocationClient : FusedLocationProviderClient, viewModel: MainViewModel) {
    val locationTask = fusedLocationClient.getCurrentLocation(Priority.PRIORITY_HIGH_ACCURACY, CancellationTokenSource().token)
    try {
        CoroutineScope(Dispatchers.Main).launch {
            val location = locationTask.await()
            viewModel.allowLocation(location)
        }
    } catch (e: Exception) {
        Log.e("MainActivity", "Error getting location: $e")
    }
}

@SuppressLint("MissingPermission")
fun subscribeToLocationUpdates(
    fusedLocationClient: FusedLocationProviderClient,
    locationCallback: LocationCallback
) {
    val locationRequest = LocationRequest
        .Builder(
            Priority.PRIORITY_HIGH_ACCURACY,
            10000L // Update interval in milliseconds
        )
        .setMinUpdateIntervalMillis(3000L) // Minimum interval between updates
        .setMinUpdateDistanceMeters(10.0F) // Minimum distance between updates
        .build()

    fusedLocationClient.requestLocationUpdates(
        locationRequest,
        locationCallback,
        null // Use default main thread
    )
}

@Composable
fun MangiaEBasta(
    viewModel: MainViewModel
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

    val context = LocalContext.current

    val fusedLocationClient = remember { LocationServices.getFusedLocationProviderClient(context) }

    val locationCallback = remember {
        object : LocationCallback() {
            override fun onLocationResult(locationResult: com.google.android.gms.location.LocationResult) {
                super.onLocationResult(locationResult)
                val location = locationResult.lastLocation
                if (location != null) {
                    Log.d("MangiaEBasta", "Saved new Location $location")
                    viewModel.allowLocation(location)
                }
                viewModel.setLoading(false)
            }

            override fun onLocationAvailability(availability: com.google.android.gms.location.LocationAvailability) {
                super.onLocationAvailability(availability)
                if (!availability.isLocationAvailable) {
                    Log.w("MangiaEBasta", "Location not available")
                }
                viewModel.setLoading(false)
            }
        }
    }

    val permissionLauncher = rememberLauncherForActivityResult(
        ActivityResultContracts.RequestPermission()
    ) { isGranted ->
        Log.d("MainActivity", "Location Permission: $isGranted!")
        if (isGranted) {
            getCurrentLocation(fusedLocationClient, viewModel)
            subscribeToLocationUpdates(fusedLocationClient, locationCallback)
        } else {
            viewModel.disallowLocation()
        }
    }


    LaunchedEffect(state.hasCheckedPermissions) {
        if (!state.hasCheckedPermissions) {
            viewModel.setLoading(true)
            val isGranted = checkLocationPermission(context)

            if (isGranted) {
                getCurrentLocation(fusedLocationClient, viewModel)
                subscribeToLocationUpdates(fusedLocationClient, locationCallback)
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
    }

    Log.d("MainActivity", "Loaded!")


    RootNavHost(
        viewModel = viewModel,
        onAskLocationPermission = {
            permissionLauncher.launch(Manifest.permission.ACCESS_FINE_LOCATION)
        }
    )

}
