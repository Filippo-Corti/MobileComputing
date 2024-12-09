package com.example.api_storage.model.types

import android.content.Context
import android.preference.Preference
import android.util.Log
import androidx.datastore.core.DataStore
import androidx.datastore.dataStore
import androidx.datastore.preferences.core.Preferences
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.intPreferencesKey
import androidx.datastore.preferences.core.stringPreferencesKey
import androidx.datastore.preferences.preferencesDataStore
import com.example.navigation_app.model.APIController
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.launch

object PreferencesController {

    private val TAG = PreferencesController::class.simpleName
    val KEYS_SID = stringPreferencesKey("sid")
    val KEYS_UID = intPreferencesKey("uid")

    suspend fun get(dataStore: DataStore<Preferences>, prefKey : Preferences.Key<*>) : Any? {
        val prefs = dataStore.data.first()
        val result = prefs[prefKey]

        return result
    }

    suspend fun <T> set(dataStore: DataStore<Preferences>, prefKey : Preferences.Key<T>, value : T) {
        dataStore.edit { prefs ->
            prefs[prefKey] = value
        }
    }


    suspend fun memorizeSessionKeys(dataStore: DataStore<Preferences>, sid : String, uid : Int) {
        this.set(dataStore, KEYS_SID, sid)
        this.set(dataStore, KEYS_UID, uid)
    }

}