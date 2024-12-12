package com.example.api_storage.viewmodel

import android.util.Log
import androidx.datastore.core.DataStore
import androidx.datastore.preferences.core.Preferences
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.api_storage.model.PreferencesController
import com.example.navigation_app.model.APIController
import com.example.navigation_app.model.types.UserSession
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch

class MainViewModel(
    private val dataStore : DataStore<Preferences>
) : ViewModel() {

    private val TAG = PreferencesController::class.simpleName

    private val _sid = MutableStateFlow<String?>(null)
    private val _uid = MutableStateFlow<Int?>(null)

    val uid : StateFlow<Int?> = _uid
    val sid : StateFlow<String?> = _sid

    fun fetchLaunchInformation() {
        viewModelScope.launch {
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

    }

}