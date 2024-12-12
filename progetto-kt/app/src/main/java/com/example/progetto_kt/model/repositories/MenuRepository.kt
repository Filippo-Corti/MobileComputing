package com.example.progetto_kt.model.repositories

import com.example.progetto_kt.model.dataclasses.menu.Menu
import com.example.progetto_kt.model.datasources.APIController

object MenuRepository {

    suspend fun getNearbyMenus(sid : String, latitude : Double, longitude : Double) : List<Menu>{
        return APIController.getNearbyMenus(sid, latitude, longitude)
    }

}