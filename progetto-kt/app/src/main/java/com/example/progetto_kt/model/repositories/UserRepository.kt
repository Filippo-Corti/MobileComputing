package com.example.progetto_kt.model.repositories

import android.util.Log
import androidx.datastore.core.DataStore
import androidx.datastore.preferences.core.Preferences
import com.example.progetto_kt.model.datasources.PreferencesController
import com.example.progetto_kt.model.dataclasses.User
import com.example.progetto_kt.model.dataclasses.UserSession
import com.example.progetto_kt.model.dataclasses.UserUpdateParams
import com.example.progetto_kt.model.datasources.APIController
import com.example.progetto_kt.model.datasources.DBController

class UserRepository(
    private val apiController: APIController,
    private val dbController: DBController,
    private val preferencesController: PreferencesController
) {

    companion object {
        private val TAG = UserRepository::class.simpleName
    }

    suspend fun isRegistered() : Boolean {
        return preferencesController.get(PreferencesController.KEYS_IS_REGISTERED) ?: false
    }


    suspend fun getUserSession() : UserSession {
        val firstLaunch = preferencesController.isFirstLaunch()
        if (!firstLaunch) {
            Log.d(TAG, "Not First Launch")
            val sid = preferencesController.get(PreferencesController.KEYS_SID)
            val uid = preferencesController.get(PreferencesController.KEYS_UID)
            Log.d(TAG, "Fetched SID and UID $sid")
            if (sid != null && uid != null) {
                return UserSession(sid, uid)
            }
        }

        Log.d(TAG, "First Launch (or an Error in Reading from the Storage)")
        val us : UserSession = apiController.createNewUserSession()
        preferencesController.memorizeSessionKeys(us.sid, us.uid)
        return us
    }

    suspend fun getUserDetails(sid : String, uid : Int) : User {
        return apiController.getUserDetails(sid, uid)
    }

    suspend fun updateUserDetails(sid : String, uid : Int, user : UserUpdateParams) {
        apiController.updateUserDetails(sid, uid, user)
        preferencesController.set(PreferencesController.KEYS_IS_REGISTERED, true)
    }

}