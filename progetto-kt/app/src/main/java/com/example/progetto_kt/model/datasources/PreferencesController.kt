package com.example.progetto_kt.model.datasources

import android.util.Log
import androidx.datastore.core.DataStore
import androidx.datastore.preferences.core.Preferences
import androidx.datastore.preferences.core.booleanPreferencesKey
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.intPreferencesKey
import androidx.datastore.preferences.core.stringPreferencesKey
import kotlinx.coroutines.flow.first

class PreferencesController(
    private val dataStore: DataStore<Preferences>
) {

    companion object {
        private val TAG = PreferencesController::class.simpleName
        val KEYS_SID = stringPreferencesKey("sid")
        val KEYS_UID = intPreferencesKey("uid")
        val KEYS_HAS_ALREADY_RUN = booleanPreferencesKey("hasAlreadyRun")
        val KEYS_IS_REGISTERED = booleanPreferencesKey("isRegistered")
        val KEYS_LAST_SCREEN = stringPreferencesKey("lastScreen")
    }

    suspend fun <T> get(prefKey : Preferences.Key<T>) : T? {
        val prefs = dataStore.data.first()
        val result = prefs[prefKey]
        Log.d(TAG, "Got $prefKey: $result")

        return result
    }

    suspend fun <T> set(prefKey : Preferences.Key<T>, value : T) {
        dataStore.edit { prefs ->
            prefs[prefKey] = value
        }
        Log.d(TAG, "Set $prefKey: $value")
    }


    suspend fun memorizeSessionKeys(sid : String, uid : Int) {
        set(KEYS_SID, sid)
        set(KEYS_UID, uid)
    }

    suspend fun isFirstLaunch() : Boolean {
        val alreadyRun = this.get(KEYS_HAS_ALREADY_RUN)
        if (alreadyRun == null) {
            this.set(KEYS_HAS_ALREADY_RUN, true)
            this.set(KEYS_IS_REGISTERED, false)
            return true
        }
        return false
    }

}