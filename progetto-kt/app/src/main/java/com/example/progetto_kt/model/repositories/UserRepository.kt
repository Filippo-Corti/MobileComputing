package com.example.progetto_kt.model.repositories

import androidx.datastore.core.DataStore
import androidx.datastore.preferences.core.Preferences
import com.example.api_storage.model.PreferencesController
import com.example.progetto_kt.model.dataclasses.User
import com.example.progetto_kt.model.dataclasses.UserSession
import com.example.progetto_kt.model.dataclasses.UserUpdateParams
import com.example.progetto_kt.model.datasources.APIController

object UserRepository {

    private val TAG = UserRepository::class.simpleName

    suspend fun isRegistered(dataStore : DataStore<Preferences>) : Boolean {
        return PreferencesController.get(dataStore, PreferencesController.KEYS_IS_REGISTERED) ?: false
    }

    suspend fun createUserSession() : UserSession {
        return APIController.createNewUserSession()
    }

    suspend fun getUserDetails(sid : String, uid : Int) : User {
        return APIController.getUserDetails(sid, uid)
    }

    suspend fun updateUserDetails(dataStore : DataStore<Preferences>, sid : String, uid : Int, user : UserUpdateParams) {
        APIController.updateUserDetails(sid, uid, user)
        PreferencesController.set(dataStore, PreferencesController.KEYS_IS_REGISTERED, true)
    }

}