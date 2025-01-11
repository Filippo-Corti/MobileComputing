package com.example.progetto_kt.model.repositories

import android.util.Log
import com.example.progetto_kt.model.datasources.PreferencesController
import com.example.progetto_kt.model.dataclasses.Menu
import com.example.progetto_kt.model.dataclasses.MenuDetails
import com.example.progetto_kt.model.dataclasses.MenuImage
import com.example.progetto_kt.model.dataclasses.MenuImageWithVersion
import com.example.progetto_kt.model.datasources.APIController
import com.example.progetto_kt.model.datasources.DBController

class MenuRepository(
    private val apiController: APIController,
    private val dbController: DBController,
    private val preferencesController: PreferencesController
) {

    companion object {
        private val TAG = MenuRepository::class.simpleName
    }

    suspend fun getNearbyMenus(sid : String, latitude : Double, longitude : Double) : List<Menu>{
        return apiController.getNearbyMenus(sid, latitude, longitude)
    }

    suspend fun getMenuDetails(sid : String, latitude : Double, longitude : Double, menuId : Int) : MenuDetails {
        return apiController.getMenuDetails(sid, latitude, longitude, menuId)
    }

    suspend fun getMenuImage(sid : String, menuId : Int, imageVersion : Int) : MenuImage {
        val menuImageInStorage = dbController.dao.getMenuImageByVersion(menuId, imageVersion)
        if (menuImageInStorage != null) {
            Log.d(TAG, "Menu Image retrieved from the Storage")
            return MenuImage(menuImageInStorage.image)
        }

        val menuImageFromServer = apiController.getMenuImage(sid, menuId)
        if (menuImageFromServer.raw.startsWith("data:image/jpeg;base64,")) {
            menuImageFromServer.raw = menuImageFromServer.raw.substring(23)
        }

        dbController.dao.insertMenuImage(
            MenuImageWithVersion(menuId, imageVersion, menuImageFromServer.raw)
        )

        Log.d(TAG, "Menu Image Fetched from Server. Now in Storage")
        return menuImageFromServer
    }

}