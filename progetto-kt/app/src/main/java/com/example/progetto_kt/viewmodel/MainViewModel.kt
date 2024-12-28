package com.example.progetto_kt.viewmodel

import android.location.Geocoder
import android.location.Location
import android.util.Log
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
import com.example.progetto_kt.model.repositories.MenuRepository
import com.example.progetto_kt.model.repositories.UserRepository
import com.example.rprogetto_kt.model.repositories.OrderRepository
import kotlinx.coroutines.CancellationException
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

data class UIState(
    val user: User? = null,
    val lastOrder: Order? = null,
    val lastOrderMenu: MenuDetails? = null,
    val nearbyMenus: List<MenuWithImage> = emptyList(),
    val selectedMenu: MenuDetailsWithImage? = null,
    val lastKnownLocation: APILocation? = null,

    val isUserRegistered: Boolean = false,
    val isLocationAllowed : Boolean = false,
    val hasCheckedPermissions : Boolean = false,
    val reloadMenus : Boolean = false,

    val isLoading: Boolean = true,
    val isFirstLaunch : Boolean = true,
    val error : Error? = null
)

class MainViewModel(
    val userRepository: UserRepository,
    val menuRepository: MenuRepository,
    val orderRepository: OrderRepository,
    val geocoder: Geocoder
) : ViewModel() {

    private val TAG = MainViewModel::class.simpleName
    private val _sid = MutableStateFlow<String?>(null)
    private val _uid = MutableStateFlow<Int?>(null)


    private val _uiState = MutableStateFlow(UIState())
    val uiState: StateFlow<UIState> = _uiState

    /*** Initialization & State Management ***/

    init {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isLoading = true)
            fetchUserSession()
            fetchAllUserData()
            Log.d(TAG, "Fetched launch information")
            _uiState.value = _uiState.value.copy(isLoading = false)
        }
    }

    fun setLoading(isLoading : Boolean) {
        _uiState.value = _uiState.value.copy(isLoading = isLoading)
    }

    fun setCheckedPermissions(hasCheckedPermissions : Boolean) {
        _uiState.value = _uiState.value.copy(hasCheckedPermissions = hasCheckedPermissions)
    }

    fun setError(error : Error) {
        if (_uiState.value.error != null) return
        _uiState.value = _uiState.value.copy(error = error)
    }

    fun resetError() {
        _uiState.value = _uiState.value.copy(error = null)
    }

    suspend fun saveNavigationStack(screen : String) {
        userRepository.saveNavigationStack(screen)
    }

    suspend fun getLastNavigationStack() : String? {
        return userRepository.getLastNavigationStack()
    }

    private suspend fun fetchAllUserData() {
        fetchUserDetails()
        fetchLastOrderDetails()
    }

    /*** Location Management ***/

    fun disallowLocation() {
        _uiState.value = _uiState.value.copy(isLocationAllowed = false)
    }

    fun allowLocation(location : Location) {
        setLastKnownLocation(location)
        if (_uiState.value.isLocationAllowed) return
        _uiState.value = _uiState.value.copy(
            isLocationAllowed = true,
            reloadMenus = true
        )
    }

    private fun setLastKnownLocation(location: Location) {
        val loc = location.toAPILocation()
        _uiState.value = _uiState.value.copy(lastKnownLocation = loc)
        viewModelScope.launch {
            loc.address = getAddressFromLocation(loc)
            _uiState.value = _uiState.value.copy(lastKnownLocation = loc)
        }
    }

    fun getCurrentLocation() : APILocation {
        val location = _uiState.value.lastKnownLocation
        if (location != null && _uiState.value.isLocationAllowed) {
            return APILocation(
                latitude = location.latitude,
                longitude = location.longitude
            )
        }
        return APILocation(45.46, 9.18) // Default Location
    }

    suspend fun getAddressFromLocation(location: APILocation): String {
        return getAddressFromCoordinates(location.latitude, location.longitude)
    }

    @Suppress("Deprecation")
    suspend fun getAddressFromCoordinates(latitude: Double, longitude: Double): String {
        return withContext(Dispatchers.IO) {
            try {
                val addresses = geocoder.getFromLocation(latitude, longitude, 1)
                if (!addresses.isNullOrEmpty()) {
                    val address = addresses[0]
                    "${address.thoroughfare ?: ""}, ${address.subThoroughfare ?: ""}, ${"(${address.postalCode})"} ${address.locality ?: ""}"
                } else ""
            } catch (e: Exception) {
                Log.e(TAG, "Error: $e")
                ""
            }
        }
    }

    /*** Data Fetching and Updating ***/

    private suspend fun runWithErrorHandling(
        checkSid: Boolean = true,
        block: suspend () -> Unit,
    ) {
        if (checkSid && (_sid.value == null || _uid.value == null)) {
            Log.d(TAG, "User not logged in, couldn't make the API call")
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
            _uiState.value = _uiState.value.copy(error = e)
        } catch (e : CancellationException) {
            Log.w(TAG, "Error: $e")
        } catch (e : Exception) {
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
            Log.d(TAG, "SID is ${_sid.value} and UID is ${_uid.value}")
        }
    }

    suspend fun fetchUserDetails() {
        if (!userRepository.isRegistered()) {
            _uiState.value = _uiState.value.copy(isUserRegistered = false)
            return
        }

        runWithErrorHandling {
            val user = userRepository.getUserDetails(
                sid = _sid.value!!,
                uid = _uid.value!!
            )
            _uiState.value = _uiState.value.copy(
                user = user,
                isUserRegistered = true
            )
        }
    }

    suspend fun updateUserData(newData : UserUpdateParams) : Boolean {
        val newUserData = newData.copy(sid = _sid.value!!)

        runWithErrorHandling {
            userRepository.updateUserDetails(
                sid = _sid.value!!,
                uid = _uid.value!!,
                user = newUserData
            )
        }

        val success = _uiState.value.error == null
        if (success) {
            fetchUserDetails()
        }
        return success
    }

    suspend fun fetchLastOrderDetails() {
        if (_uiState.value.user?.lastOrderId == null)
            return

        runWithErrorHandling {
            val order = orderRepository.getOrderDetails(
                sid = _sid.value!!,
                orderId = _uiState.value.user!!.lastOrderId!!,
            )
            order.currentLocation.address = getAddressFromLocation(order.currentLocation)
            order.deliveryLocation.address = getAddressFromLocation(order.deliveryLocation)
            _uiState.value = _uiState.value.copy(lastOrder = order)
        }

        val success = _uiState.value.error == null
        if (success) {
            fetchOrderedMenu()
        }
    }

    suspend fun orderMenu(menuId: Int): Boolean {
        if(!_uiState.value.isUserRegistered) {
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

        if (!_uiState.value.isLocationAllowed) {
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
                deliveryLocation = getCurrentLocation()
            )
            order.currentLocation.address = getAddressFromLocation(order.currentLocation)
            order.deliveryLocation.address = getAddressFromLocation(order.deliveryLocation)
            _uiState.value = _uiState.value.copy(lastOrder = order)
        }

        val success = _uiState.value.error == null
        if (success) {
            fetchUserDetails()
            fetchOrderedMenu()
        }
        return success
    }

    suspend fun fetchOrderedMenu() {
        if (_uiState.value.lastOrder?.menuId == null)
            return

        val location = getCurrentLocation()
        runWithErrorHandling {
            val menu = menuRepository.getMenuDetails(
                sid = _sid.value!!,
                latitude = location.latitude,
                longitude = location.longitude,
                menuId = _uiState.value.lastOrder?.menuId!!
            )
            menu.location.address = getAddressFromLocation(menu.location)
            _uiState.value = _uiState.value.copy(lastOrderMenu = menu)
        }
    }

    suspend fun fetchNearbyMenus() {
        val location = getCurrentLocation()
        Log.d(TAG, "Fetching Menus near ${location.latitude}, ${location.longitude}")
        runWithErrorHandling {
            val menus = menuRepository.getNearbyMenus(
                sid = _sid.value!!,
                latitude = location.latitude,
                longitude = location.longitude
            )
            val menusWithImages = menus.map { menu ->
                val image = menuRepository.getMenuImage(
                    sid = _sid.value!!,
                    menuId = menu.id,
                    imageVersion = menu.imageVersion
                )
                menu.location.address = getAddressFromLocation(menu.location)
                MenuWithImage(menu, image)
            }
            _uiState.value = _uiState.value.copy(
                nearbyMenus = menusWithImages,
                reloadMenus = false
            )
        }
    }

    suspend fun fetchMenuDetails(menuId: Int) {
        if (_uiState.value.selectedMenu?.menuDetails?.id == menuId)
            return

        val location = getCurrentLocation()
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
            _uiState.value =
                _uiState.value.copy(selectedMenu = MenuDetailsWithImage(menuDetails, image))
        }
    }

}