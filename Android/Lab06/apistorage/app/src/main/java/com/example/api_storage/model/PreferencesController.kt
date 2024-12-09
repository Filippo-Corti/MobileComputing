package com.example.api_storage.model

import androidx.datastore.core.DataStore
import androidx.datastore.preferences.core.Preferences
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.intPreferencesKey
import androidx.datastore.preferences.core.stringPreferencesKey
import kotlinx.coroutines.flow.first

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
        set(dataStore, KEYS_SID, sid)
        set(dataStore, KEYS_UID, uid)
    }

}