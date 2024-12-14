package com.example.progetto_kt.viewmodel

import android.util.Log
import androidx.datastore.core.DataStore
import androidx.datastore.preferences.core.Preferences
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.api_storage.model.PreferencesController
import com.example.progetto_kt.model.dataclasses.Menu
import com.example.progetto_kt.model.dataclasses.MenuDetailsWithImage
import com.example.progetto_kt.model.dataclasses.User
import com.example.progetto_kt.model.dataclasses.UserSession
import com.example.progetto_kt.model.dataclasses.UserUpdateParams
import com.example.progetto_kt.model.repositories.MenuRepository
import com.example.progetto_kt.model.repositories.UserRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch

class MainViewModel(
    private val dataStore : DataStore<Preferences>
) : ViewModel() {

    private val TAG = MainViewModel::class.simpleName

    private val _sid = MutableStateFlow<String?>(null)
    private val _uid = MutableStateFlow<Int?>(null)

    private val _isLoading = MutableStateFlow(true)
    private val _user = MutableStateFlow<User?>(null)
    private val _menus = MutableStateFlow<List<Menu>>(emptyList())
    private val _menuDetails = MutableStateFlow<MenuDetailsWithImage?>(null)

    val sid : StateFlow<String?> = _sid
    val user: StateFlow<User?> = _user
    val menus: StateFlow<List<Menu>> = _menus
    val isLoading: StateFlow<Boolean> = _isLoading
    val menuDetails : StateFlow<MenuDetailsWithImage?> = _menuDetails

    init {
        viewModelScope.launch {
            fetchLaunchInformation()
            if (UserRepository.isRegistered(dataStore))
                fetchUserData()
            fetchNearbyMenus()
            Log.d(TAG, "Fetched launch information and menus")
            _isLoading.value = false
        }
    }

    suspend fun fetchLaunchInformation() {
        val firstLaunch = PreferencesController.isFirstLaunch(dataStore)
        if (firstLaunch) {
            Log.d(TAG, "First Launch")
            val us : UserSession = UserRepository.createUserSession()
            PreferencesController.memorizeSessionKeys(dataStore, us.sid, us.uid)
            _sid.value = us.sid
            _uid.value = us.uid
        } else {
            Log.d(TAG, "Not First Launch")
            _sid.value = PreferencesController.get(dataStore, PreferencesController.KEYS_SID)
            _uid.value = PreferencesController.get(dataStore, PreferencesController.KEYS_UID)
        }
        Log.d(TAG, "SID is ${_sid.value} and UID is ${_uid.value}")
    }

    fun fetchUserData() {
        if (_sid.value == null || _uid.value == null) {
            Log.d(TAG, "User not logged in, couldn't get user data")
            return
        }

        viewModelScope.launch {
            try {
                val user = UserRepository.getUserDetails(_sid.value!!, _uid.value!!)
                _user.value = user
            } catch (e: Exception) {
                Log.e(TAG, "Error fetching user data: ${e.message}")
            }
        }
    }

    fun updateUserData(newData : UserUpdateParams) {
        if (_sid.value == null || _uid.value == null) {
            Log.d(TAG, "User not logged in, couldn't update user data")
            return
        }

        viewModelScope.launch {
            try {
                UserRepository.updateUserDetails(
                    dataStore = dataStore,
                    sid = _sid.value!!,
                    uid = _uid.value!!,
                    user = newData
                )
                fetchUserData()
            } catch (e: Exception) {
                Log.e(TAG, "Error updating user data: ${e.message}")
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
                val menus = MenuRepository.getNearbyMenus(
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
                val menuDetails = MenuRepository.getMenuDetails(
                    sid = _sid.value!!,
                    latitude = 45.46,
                    longitude = 9.18,
                    menuId = menuId
                )
                val image = MenuRepository.getMenuImage(
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