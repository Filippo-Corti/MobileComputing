package com.example.progetto_kt.viewmodel

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
import com.example.progetto_kt.model.repositories.MenuRepository
import com.example.progetto_kt.model.repositories.UserRepository
import com.example.rprogetto_kt.model.repositories.OrderRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch


data class UIState(
    val user: User? = null,
    val lastOrder: Order? = null,
    val lastOrderMenu: MenuDetails? = null,
    val nearbyMenus: List<MenuWithImage> = emptyList(),
    val selectedMenu: MenuDetailsWithImage? = null,
    val lastKnownLocation: Location? = null,

    val isUserRegistered: Boolean = false,
    val isLocationAllowed : Boolean = false,

    val isLoading: Boolean = true,
    val error : Error? = null
)

class MainViewModel(
    val userRepository: UserRepository,
    val menuRepository: MenuRepository,
    val orderRepository: OrderRepository
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
            fetchNearbyMenus()
            Log.d(TAG, "Fetched launch information and menus")
            _uiState.value = _uiState.value.copy(isLoading = false)
        }
    }

    fun setError(error : Error) {
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
        fetchOrderedMenu()
    }

    /*** Location Management ***/

    fun setLocationAllowed(isAllowed : Boolean) {
        _uiState.value = _uiState.value.copy(isLocationAllowed = isAllowed)
    }

    fun setLastKnownLocation(location: Location) {
        _uiState.value = _uiState.value.copy(lastKnownLocation = location)
    }

    fun getCurrentLocation() : APILocation {
        val location = _uiState.value.lastKnownLocation
        if (location != null && !_uiState.value.isLocationAllowed) {
            return APILocation(
                latitude = location.latitude,
                longitude = location.longitude
            )
        }
        return APILocation(45.46, 9.18) // Default Location
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
        } catch (e : Exception) {
            Log.e(TAG, "Error: ${e.message}")
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

        runWithErrorHandling {
            val order = orderRepository.buyMenu(
                sid = _sid.value!!,
                menuId = menuId,
                deliveryLocation = getCurrentLocation()
            )
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
                MenuWithImage(menu, image)
            }
            _uiState.value = _uiState.value.copy(nearbyMenus = menusWithImages)
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