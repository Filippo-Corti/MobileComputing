package com.example.progetto_kt.viewmodel

import android.util.Log
import androidx.datastore.core.DataStore
import androidx.datastore.preferences.core.Preferences
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.api_storage.model.PreferencesController
import com.example.progetto_kt.model.dataclasses.menu.Menu
import com.example.progetto_kt.model.dataclasses.user.UserSession
import com.example.progetto_kt.model.datasources.APIController
import com.example.progetto_kt.model.repositories.MenuRepository
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch

class MainViewModel(
    private val dataStore : DataStore<Preferences>
) : ViewModel() {

    private val TAG = MainViewModel::class.simpleName

    private val _isLoading = MutableStateFlow(true)
    private val _sid = MutableStateFlow<String?>(null)
    private val _uid = MutableStateFlow<Int?>(null)
    private val _menus = MutableStateFlow<List<Menu>>(emptyList())

    val uid : StateFlow<Int?> = _uid
    val sid : StateFlow<String?> = _sid
    val menus: StateFlow<List<Menu>> = _menus
    val isLoading: StateFlow<Boolean> = _isLoading

    init {
        viewModelScope.launch {
            delay(3000) //TODO: Remove this delay
            fetchLaunchInformation()
            fetchNearbyMenus()
            _isLoading.value = false
        }
    }

    suspend fun fetchLaunchInformation() {
        val firstLaunch = PreferencesController.isFirstLaunch(dataStore)
        if (firstLaunch) {
            Log.d(TAG, "First Launch")
            val us : UserSession = APIController.createNewUserSession()
            PreferencesController.memorizeSessionKeys(dataStore, us.sid, us.uid)
            _sid.value = us.sid
            _uid.value = us.uid
        } else {
            Log.d(TAG, "Not First Launch")
            _sid.value = PreferencesController.get(dataStore, PreferencesController.KEYS_SID)
            _uid.value = PreferencesController.get(dataStore, PreferencesController.KEYS_UID)
        }
        Log.d(TAG, "SID is ${sid.value} and UID is ${uid.value}")
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

}