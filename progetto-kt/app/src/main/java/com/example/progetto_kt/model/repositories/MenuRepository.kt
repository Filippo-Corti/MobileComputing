package com.example.progetto_kt.model.repositories

import com.example.progetto_kt.model.dataclasses.Menu
import com.example.progetto_kt.model.dataclasses.MenuDetails
import com.example.progetto_kt.model.datasources.APIController

object MenuRepository {

    suspend fun getNearbyMenus(sid : String, latitude : Double, longitude : Double) : List<Menu>{
        return APIController.getNearbyMenus(sid, latitude, longitude)
    }

    suspend fun getMenuDetails(sid : String, latitude : Double, longitude : Double, menuId : Int) : MenuDetails {
        return APIController.getMenuDetails(sid, latitude, longitude, menuId)
    }

}