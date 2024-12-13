package com.example.progetto_kt.model.repositories

import android.util.Log
import com.example.progetto_kt.model.dataclasses.Menu
import com.example.progetto_kt.model.dataclasses.MenuDetails
import com.example.progetto_kt.model.dataclasses.MenuImage
import com.example.progetto_kt.model.dataclasses.MenuImageWithVersion
import com.example.progetto_kt.model.datasources.APIController
import com.example.progetto_kt.model.datasources.DBController
import com.example.progetto_kt.viewmodel.MainViewModel

object MenuRepository {

    private val TAG = MenuRepository::class.simpleName

    suspend fun getNearbyMenus(sid : String, latitude : Double, longitude : Double) : List<Menu>{
        return APIController.getNearbyMenus(sid, latitude, longitude)
    }

    suspend fun getMenuDetails(sid : String, latitude : Double, longitude : Double, menuId : Int) : MenuDetails {
        return APIController.getMenuDetails(sid, latitude, longitude, menuId)
    }

    suspend fun getMenuImage(sid : String, menuId : Int, imageVersion : Int) : MenuImage {
        val menuImageInStorage = DBController.dao.getMenuImageByVersion(menuId, imageVersion)
        if (menuImageInStorage != null) {
            Log.d(TAG, "Menu Image Found in Storage")
            return MenuImage(menuImageInStorage.image)
        }

        val menuImageFromServer = APIController.getMenuImage(sid, menuId)
        if (!menuImageFromServer.image.startsWith("data:image/jpeg;base64,")) {
            menuImageFromServer.image = "data:image/jpeg;base64," + menuImageFromServer.image
        }

        DBController.dao.insertMenuImage(
            MenuImageWithVersion(menuId, imageVersion, menuImageFromServer.image)
        )

        Log.d(TAG, "Menu Image Fetched from Server. Now in Storage")
        return menuImageFromServer
    }

}