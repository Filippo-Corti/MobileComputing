package com.example.progetto_kt.viewmodel

import android.util.Log
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.progetto_kt.model.dataclasses.Location
import com.example.progetto_kt.model.dataclasses.Menu
import com.example.progetto_kt.model.dataclasses.MenuDetailsWithImage
import com.example.progetto_kt.model.dataclasses.Order
import com.example.progetto_kt.model.dataclasses.User
import com.example.progetto_kt.model.dataclasses.UserWithOrder
import com.example.progetto_kt.model.repositories.MenuRepository
import com.example.progetto_kt.model.repositories.UserRepository
import com.example.rprogetto_kt.model.repositories.OrderRepository
import kotlinx.coroutines.coroutineScope
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch

class MainViewModel(
    val userRepository: UserRepository,
    val menuRepository: MenuRepository,
    val orderRepository: OrderRepository
) : ViewModel() {

    private val TAG = MainViewModel::class.simpleName

    private val _sid = MutableStateFlow<String?>(null)
    private val _uid = MutableStateFlow<Int?>(null)

    private val _isLoading = MutableStateFlow(true)
    private val _userWithOrder = MutableStateFlow<UserWithOrder>(UserWithOrder())
    private val _menus = MutableStateFlow<List<Menu>>(emptyList())
    private val _menuDetails = MutableStateFlow<MenuDetailsWithImage?>(null)

    val userWithOrder: StateFlow<UserWithOrder> = _userWithOrder
    val menus: StateFlow<List<Menu>> = _menus
    val isLoading: StateFlow<Boolean> = _isLoading
    val menuDetails : StateFlow<MenuDetailsWithImage?> = _menuDetails

    init {
        viewModelScope.launch {
            _isLoading.value = true
            coroutineScope {
                fetchUserSession()
                Log.d(TAG, "Fetch Session ended (in theory)")
                fetchUserDetails()
                if (_userWithOrder.value.user != null && _userWithOrder.value.user?.lastOrderId != null) {
                    Log.d(TAG, "Fetching Order Details")
                    fetchOrderDetails(_userWithOrder.value.user?.lastOrderId!!)
                }
                fetchNearbyMenus()
                Log.d(TAG, "Fetched launch information and menus")
                _isLoading.value = false
            }
        }
    }

    fun fetchUserSession() {
        viewModelScope.launch {
            val us = userRepository.getUserSession()
            _sid.value = us.sid
            _uid.value = us.uid
            Log.d(TAG, "SID is ${_sid.value} and UID is ${_uid.value}")
        }
    }

    fun fetchUserDetails() {
        if (_sid.value == null || _uid.value == null) {
            Log.d(TAG, "User not logged in, couldn't get user data")
            return
        }

        viewModelScope.launch {

            if (!userRepository.isRegistered())
                return@launch

            try {
                val user = userRepository.getUserDetails(_sid.value!!, _uid.value!!)
                _userWithOrder.value = _userWithOrder.value.copy(user = user)
            } catch (e: Exception) {
                Log.e(TAG, "Error fetching user data: ${e.message}")
            }
        }
    }

    fun fetchOrderDetails(orderId : Int) {
        if (_menuDetails.value?.menuDetails?.id == orderId) {
            Log.d(TAG, "Order details already fetched")
            return
        }

        if (_sid.value == null || _uid.value == null) {
            Log.d(TAG, "User not logged in, couldn't get nearby menus")
            return
        }

        viewModelScope.launch {
            try {
                val order = orderRepository.getOrderDetails(
                    sid = _sid.value!!,
                    orderId = orderId,
                )
                _userWithOrder.value = _userWithOrder.value.copy(lastOrder = order)
            } catch (e: Exception) {
                Log.e(TAG, "Error fetching order data: ${e.message}")
            }
        }
    }

    fun buyMenu(menuId : Int) {
        if (_sid.value == null || _uid.value == null) {
            Log.d(TAG, "User not logged in, couldn't get nearby menus")
            return
        }

        viewModelScope.launch {
            try {
                val order = orderRepository.buyMenu(
                    sid = _sid.value!!,
                    menuId = menuId,
                    deliveryLocation = Location(
                        45.4642,
                        9.19
                    )
                )
                _userWithOrder.value = _userWithOrder.value.copy(lastOrder = order)
            } catch (e: Exception) {
                Log.e(TAG, "Error buying menu: ${e.message}")
            }
        }
    }


    fun fetchNearbyMenus() {
        if (_sid.value == null || _uid.value == null) {
            Log.d(TAG, "User not logged in, couldn't get nearby menus")
            return
        }

        viewModelScope.launch {
            try {
                val menus = menuRepository.getNearbyMenus(
                    sid = _sid.value!!,
                    latitude = 45.46,
                    longitude = 9.18
                )
                _menus.value = menus
            } catch (e: Exception) {
                Log.e(TAG, "Error fetching menus: ${e.message}")
            }
        }
    }

    fun fetchMenuDetails(menuId : Int) {
        if (_menuDetails.value?.menuDetails?.id == menuId) {
            Log.d(TAG, "Menu details already fetched")
            return
        }

        if (_sid.value == null || _uid.value == null) {
            Log.d(TAG, "User not logged in, couldn't get nearby menus")
            return
        }

        Log.d(TAG, "Fetching menu details for menuId $menuId")

        viewModelScope.launch {
            try {
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
                _menuDetails.value = MenuDetailsWithImage(menuDetails, image)
            } catch (e: Exception) {
                Log.e(TAG, "Error fetching menus: ${e.message}")
            }
        }
    }

}