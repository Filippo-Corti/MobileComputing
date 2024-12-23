package com.example.progetto_kt.viewmodel

import android.util.Log
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.progetto_kt.model.dataclasses.Location
import com.example.progetto_kt.model.dataclasses.Menu
import com.example.progetto_kt.model.dataclasses.MenuDetails
import com.example.progetto_kt.model.dataclasses.MenuDetailsWithImage
import com.example.progetto_kt.model.dataclasses.MenuWithImage
import com.example.progetto_kt.model.dataclasses.Order
import com.example.progetto_kt.model.dataclasses.User
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

    val isLoading: Boolean = true,
    val errorMessage: String? = null
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

    fun resetErrorMessage() {
        _uiState.value = _uiState.value.copy(errorMessage = null)
    }

    private suspend fun fetchAllUserData() {
        fetchUserDetails()
        fetchLastOrderDetails()
        fetchOrderedMenu()
    }

    private suspend fun runWithErrorHandling(
        checkSid: Boolean = true,
        block: suspend () -> Unit,
    ) {
        if (checkSid && (_sid.value == null || _uid.value == null)) {
            Log.d(TAG, "User not logged in, couldn't make the API call")
            _uiState.value = _uiState.value.copy(errorMessage = "Authentication Error")
            return
        }

        try {
            block()
        } catch (e: Exception) {
            Log.e(TAG, "Error: ${e.message}")
            _uiState.value = _uiState.value.copy(errorMessage = e.message)
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
        if (!userRepository.isRegistered())
            return

        runWithErrorHandling {
            val user = userRepository.getUserDetails(
                sid = _sid.value!!,
                uid = _uid.value!!
            )
            _uiState.value = _uiState.value.copy(user = user)
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

        val success = _uiState.value.errorMessage == null
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

        val success = _uiState.value.errorMessage == null
        if (success) {
            fetchOrderedMenu()
        }
    }

    suspend fun orderMenu(menuId: Int): Boolean {
        runWithErrorHandling {
            val order = orderRepository.buyMenu(
                sid = _sid.value!!,
                menuId = menuId,
                deliveryLocation = Location(
                    45.4642,
                    9.19
                )
            )
            _uiState.value = _uiState.value.copy(lastOrder = order)
        }

        val success = _uiState.value.errorMessage == null
        if (success) {
            fetchUserDetails()
            fetchOrderedMenu()
        }
        return success
    }

    suspend fun fetchOrderedMenu() {
        if (_uiState.value.lastOrder?.menuId == null)
            return

        runWithErrorHandling {
            val menu = menuRepository.getMenuDetails(
                sid = _sid.value!!,
                latitude = 45.46,
                longitude = 9.18,
                menuId = _uiState.value.lastOrder?.menuId!!
            )
            _uiState.value = _uiState.value.copy(lastOrderMenu = menu)
        }
    }

    suspend fun fetchNearbyMenus() {
        runWithErrorHandling {
            val menus = menuRepository.getNearbyMenus(
                sid = _sid.value!!,
                latitude = 45.46,
                longitude = 9.18
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

        runWithErrorHandling {
            val menuDetails = menuRepository.getMenuDetails(
                sid = _sid.value!!,
                latitude = 45.46,
                longitude = 9.18,
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