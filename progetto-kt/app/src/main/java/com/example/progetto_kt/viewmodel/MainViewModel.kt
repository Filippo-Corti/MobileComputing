package com.example.progetto_kt.viewmodel

import android.Manifest
import android.annotation.SuppressLint
import android.content.Context
import android.content.pm.PackageManager
import android.location.Geocoder
import android.location.Location
import android.util.Log
import androidx.core.content.ContextCompat
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.progetto_kt.model.dataclasses.APILocation
import com.example.progetto_kt.model.dataclasses.MenuDetails
import com.example.progetto_kt.model.dataclasses.MenuDetailsWithImage
import com.example.progetto_kt.model.dataclasses.MenuWithImage
import com.example.progetto_kt.model.dataclasses.Order
import com.example.progetto_kt.model.dataclasses.User
import com.example.progetto_kt.model.dataclasses.Error
import com.example.progetto_kt.model.dataclasses.ErrorType
import com.example.progetto_kt.model.dataclasses.UserUpdateParams
import com.example.progetto_kt.model.dataclasses.toAPILocation
import com.example.progetto_kt.model.dataclasses.toPoint
import com.example.progetto_kt.model.repositories.MenuRepository
import com.example.progetto_kt.model.repositories.UserRepository
import com.example.rprogetto_kt.model.repositories.OrderRepository
import com.google.android.gms.location.FusedLocationProviderClient
import com.google.android.gms.location.LocationCallback
import com.google.android.gms.location.LocationRequest
import com.google.android.gms.location.Priority
import com.google.android.gms.tasks.CancellationTokenSource
import kotlinx.coroutines.CancellationException
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch
import kotlinx.coroutines.tasks.await
import kotlinx.coroutines.withContext

data class UserState(
    val user: User? = null,
    val isUserRegistered: Boolean = false,
)

data class LastOrderState(
    val lastOrder: Order? = null,
    val lastOrderMenu: MenuDetailsWithImage? = null,
)

data class LocationState(
    val lastKnownLocation: APILocation? = null,
    val isLocationAllowed: Boolean = false,
    val hasCheckedPermissions: Boolean = false,
)

data class MenusExplorationState(
    val nearbyMenus: List<MenuWithImage> = emptyList(),
    val selectedMenu: MenuDetailsWithImage? = null,
    val reloadMenus: Boolean = false,
)

data class AppState(
    val isLoading: Boolean = true,
    val isFirstLaunch: Boolean = true,
    val error: Error? = null
)

class MainViewModel(
    private val userRepository: UserRepository,
    private val menuRepository: MenuRepository,
    private val orderRepository: OrderRepository,
    private val geocoder: Geocoder,
    private val locationClient: FusedLocationProviderClient,
) : ViewModel() {

    companion object {
        val DEFAULT_LOCATION = APILocation(
            latitude = 45.4642,
            longitude = 9.19,
            address = "Milan, Italy"
        )
    }

    private val TAG = MainViewModel::class.simpleName
    private val _sid = MutableStateFlow<String?>(null)
    private val _uid = MutableStateFlow<Int?>(null)

    private val _userState = MutableStateFlow(UserState())
    val userState: StateFlow<UserState> = _userState

    private val _lastOrderState = MutableStateFlow(LastOrderState())
    val lastOrderState: StateFlow<LastOrderState> = _lastOrderState

    private val _locationState = MutableStateFlow(LocationState())
    val locationState: StateFlow<LocationState> = _locationState

    private val _menusExplorationState = MutableStateFlow(MenusExplorationState())
    val menusExplorationState: StateFlow<MenusExplorationState> = _menusExplorationState

    private val _appState = MutableStateFlow(AppState())
    val appState: StateFlow<AppState> = _appState

    /*** Initialization & State Management ***/

    init {
        setLoading(true)
        viewModelScope.launch {
            fetchUserSession()
            fetchUserDetails()
            setLoading(false)
        }
    }

    fun setLoading(isLoading: Boolean) {
        _appState.value = _appState.value.copy(isLoading = isLoading)
    }

    fun setCheckedPermissions(hasCheckedPermissions: Boolean) {
        _locationState.value =
            _locationState.value.copy(hasCheckedPermissions = hasCheckedPermissions)
    }

    fun setError(error: Error) {
        if (_appState.value.error != null) return
        _appState.value = _appState.value.copy(error = error)
    }

    fun resetError() {
        _appState.value = _appState.value.copy(error = null)
    }

    suspend fun saveNavigationStack(screen: String) {
        userRepository.saveNavigationStack(screen)
    }

    suspend fun getLastNavigationStack(): String? {
        return userRepository.getLastNavigationStack()
    }

    fun getUserRepository(): UserRepository {
        return userRepository
    }

    /*** Location Management ***/

    fun disallowLocation() {
        _locationState.value = _locationState.value.copy(isLocationAllowed = false)
    }

    fun allowLocation(location: Location) {
        setLastKnownLocation(location)
        if (_locationState.value.isLocationAllowed) return
        _locationState.value = _locationState.value.copy(
            isLocationAllowed = true,
        )
        _menusExplorationState.value = _menusExplorationState.value.copy(
            reloadMenus = true
        )
    }

    private fun setLastKnownLocation(location: Location) {
        val loc = location.toAPILocation()
        _locationState.value =
            _locationState.value.copy(lastKnownLocation = loc) // Quick update, synchronously
        viewModelScope.launch {
            loc.address = getAddressFromLocation(loc)
            _locationState.value =
                _locationState.value.copy(lastKnownLocation = loc) // Slow update, asynchronously
        }
    }

    fun getCurrentAPILocation(): APILocation {
        val location = _locationState.value.lastKnownLocation
        if (location != null && _locationState.value.isLocationAllowed) {
            return APILocation(
                latitude = location.latitude,
                longitude = location.longitude
            )
        }
        return DEFAULT_LOCATION
    }

    suspend fun getAddressFromLocation(location: APILocation): String {
        return getAddressFromCoordinates(location.latitude, location.longitude)
    }

    @Suppress("Deprecation")
    suspend fun getAddressFromCoordinates(latitude: Double, longitude: Double): String {
        return withContext(Dispatchers.IO) {
            try {
                val addresses = geocoder.getFromLocation(latitude, longitude, 1)
                if (addresses.isNullOrEmpty()) return@withContext "";

                val address = addresses[0]
                address.getAddressLine(0)
            } catch (e: Exception) {
                Log.e(TAG, "Error: $e")
                ""
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
    fun getCurrentLocation() {
        val locationTask = locationClient.getCurrentLocation(
            Priority.PRIORITY_HIGH_ACCURACY,
            CancellationTokenSource().token
        )
        try {
            viewModelScope.launch {
                val location = locationTask.await()
                allowLocation(location)
            }
        } catch (e: Exception) {
            Log.w(TAG, "Error getting location: $e")
        }
    }

    @SuppressLint("MissingPermission")
    fun subscribeToLocationUpdates(
        locationCallback: LocationCallback
    ) {
        val locationRequest = LocationRequest
            .Builder(Priority.PRIORITY_HIGH_ACCURACY, 10000L)
            .setMinUpdateIntervalMillis(3000L) // Minimum interval between updates
            .setMinUpdateDistanceMeters(10.0F) // Minimum distance between updates
            .build()

        locationClient.requestLocationUpdates(locationRequest, locationCallback, null)
    }

    fun distanceFromUserLocation(
        location: APILocation
    ): Float {
        if (!_locationState.value.isLocationAllowed || _locationState.value.lastKnownLocation == null) {
            return -1F
        }

        val userLocation = _locationState.value.lastKnownLocation!!
        val startPoint = Location("start").apply {
            latitude = userLocation.latitude
            longitude = userLocation.longitude
        }
        val endPoint = Location("end").apply {
            latitude = location.latitude
            longitude = location.longitude
        }

        return startPoint.distanceTo(endPoint) / 1000
    }

    /*** Data Fetching and Updating ***/

    private suspend fun runWithErrorHandling(
        checkSid: Boolean = true,
        block: suspend () -> Unit,
    ) {
        if (checkSid && (_sid.value == null || _uid.value == null)) {
            Log.d(TAG, "User Session not Retrieved Yet. Couldn't make the API Call")
            setError(
                error = Error(
                    type = ErrorType.NETWORK,
                    title = "Authentication Error",
                    actionText = "Try Again",
                    message = "We couldn't authenticate you, please try un-installing and re-installing the app."
                )
            )
            return
        }

        try {
            block()
        } catch (e: Error) {
            Log.e(TAG, "Error: ${e.message}")
            setError(e)
        } catch (e: CancellationException) {
            Log.w(TAG, "Error: $e")
        } catch (e: Exception) {
            Log.e(TAG, "Error: $e")
            setError(
                error = Error(
                    type = ErrorType.NETWORK,
                    title = "Unexpected Error",
                    actionText = "Try Again",
                    message = "We encountered an unexpected error, please try closing and re-opening the app. \nIf the problem persists, please contact support."
                )
            )
        }
    }

    suspend fun fetchUserSession() {
        runWithErrorHandling(checkSid = false) {
            val us = userRepository.getUserSession()
            _sid.value = us.sid
            _uid.value = us.uid
        }
    }

    suspend fun fetchUserDetails() {
        if (!userRepository.isRegistered()) {
            _userState.value = _userState.value.copy(isUserRegistered = false)
            return
        }

        runWithErrorHandling {
            val user = userRepository.getUserDetails(
                sid = _sid.value!!,
                uid = _uid.value!!
            )
            _userState.value = _userState.value.copy(
                user = user,
                isUserRegistered = true
            )
        }
    }

    suspend fun updateUserData(newData: UserUpdateParams): Boolean {
        val newUserData = newData.copy(sid = _sid.value!!)

        runWithErrorHandling {
            userRepository.updateUserDetails(
                sid = _sid.value!!,
                uid = _uid.value!!,
                user = newUserData
            )
        }

        val success = _appState.value.error == null
        if (success) {
            fetchUserDetails()
        }
        return success
    }

    suspend fun fetchLastOrderDetails() {
        if (_userState.value.user?.lastOrderId == null)
            return

        runWithErrorHandling {
            val order = orderRepository.getOrderDetails(
                sid = _sid.value!!,
                orderId = _userState.value.user!!.lastOrderId!!,
            )
            order.currentLocation.address = getAddressFromLocation(order.currentLocation)
            order.deliveryLocation.address = getAddressFromLocation(order.deliveryLocation)
            _lastOrderState.value = _lastOrderState.value.copy(
                lastOrder = order
            )
            _userState.value = _userState.value.copy(
                user = _userState.value.user?.copy(
                    lastOrderId = order.id,
                    orderStatus = order.status
                )
            )
        }

        val success = _appState.value.error == null
        if (success) {
            fetchOrderedMenu()
        }
    }

    suspend fun orderMenu(menuId: Int): Boolean {
        if (!_userState.value.isUserRegistered) {
            setError(
                error = Error(
                    type = ErrorType.ACCOUNT_DETAILS,
                    title = "Please Register",
                    message = "You need to register before you can order a menu.",
                    actionText = "Register"
                )
            )
            return false
        }

        if (!_locationState.value.isLocationAllowed) {
            setError(
                error = Error(
                    type = ErrorType.POSITION_UNALLOWED,
                    title = "Location Not Allowed",
                    message = "Please allow location access to place an order.",
                    actionText = "Allow Location"
                )
            )
            return false
        }

        runWithErrorHandling {
            val order = orderRepository.buyMenu(
                sid = _sid.value!!,
                menuId = menuId,
                deliveryLocation = getCurrentAPILocation()
            )
            order.currentLocation.address = getAddressFromLocation(order.currentLocation)
            order.deliveryLocation.address = getAddressFromLocation(order.deliveryLocation)
            _lastOrderState.value = _lastOrderState.value.copy(
                lastOrder = order
            )
            _userState.value = _userState.value.copy(
                user = _userState.value.user?.copy(
                    lastOrderId = order.id,
                    orderStatus = order.status
                )
            )
        }

        val success = _appState.value.error == null
        if (success) {
            fetchOrderedMenu()
        }
        return success
    }

    suspend fun fetchOrderedMenu() {
        if (_lastOrderState.value.lastOrder?.menuId == null)
            return

        val location = getCurrentAPILocation()
        val menuId = _lastOrderState.value.lastOrder?.menuId!!
        runWithErrorHandling {
            val menu = menuRepository.getMenuDetails(
                sid = _sid.value!!,
                latitude = location.latitude,
                longitude = location.longitude,
                menuId = menuId
            )
            menu.location.address = getAddressFromLocation(menu.location)
            val image = menuRepository.getMenuImage(
                sid = _sid.value!!,
                menuId = menuId,
                imageVersion = menu.imageVersion
            )
            _lastOrderState.value = _lastOrderState.value.copy(
                lastOrderMenu = MenuDetailsWithImage(menu, image)
            )
        }
    }

    // Fetches Menu Images Asynchronously
    fun fetchNearbyMenusAsync(runBeforeFetchingImages: () -> Unit) {
        viewModelScope.launch {
            fetchNearbyMenus(runBeforeFetchingImages)
        }
    }

    suspend fun fetchNearbyMenus(runBeforeFetchingImages: () -> Unit = {}) {
        val location = getCurrentAPILocation()
        runWithErrorHandling {
            val menus = menuRepository.getNearbyMenus(
                sid = _sid.value!!,
                latitude = location.latitude,
                longitude = location.longitude
            )
            val menusWithNoImages = menus.map { menu ->
                MenuWithImage(menu, null)
            }
            _menusExplorationState.value = _menusExplorationState.value.copy(
                nearbyMenus = menusWithNoImages,
                reloadMenus = false
            )

            runBeforeFetchingImages()

            menus.forEach { menu ->
                val image = menuRepository.getMenuImage(
                    sid = _sid.value!!,
                    menuId = menu.id,
                    imageVersion = menu.imageVersion
                )
                menu.location.address = getAddressFromLocation(menu.location)
                val updatedMenu = MenuWithImage(menu, image)

                _menusExplorationState.value = _menusExplorationState.value.copy(
                    nearbyMenus = _menusExplorationState.value.nearbyMenus.map {
                        if (it.menu.id == menu.id) updatedMenu else it
                    }
                )
            }
        }
    }

    suspend fun fetchMenuDetails(menuId: Int) {
        if (_menusExplorationState.value.selectedMenu?.menuDetails?.id == menuId)
            return

        val location = getCurrentAPILocation()
        runWithErrorHandling {
            val menuDetails = menuRepository.getMenuDetails(
                sid = _sid.value!!,
                latitude = location.latitude,
                longitude = location.longitude,
                menuId = menuId
            )
            menuDetails.location.address = getAddressFromLocation(menuDetails.location)
            val image = menuRepository.getMenuImage(
                sid = _sid.value!!,
                menuId = menuId,
                imageVersion = menuDetails.imageVersion
            )
            _menusExplorationState.value = _menusExplorationState.value.copy(
                selectedMenu = MenuDetailsWithImage(menuDetails, image)
            )
        }
    }

}
