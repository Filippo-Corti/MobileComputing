package com.example.rprogetto_kt.model.repositories

import com.example.progetto_kt.model.dataclasses.Location
import com.example.progetto_kt.model.dataclasses.Order
import com.example.progetto_kt.model.datasources.APIController
import com.example.progetto_kt.model.datasources.DBController
import com.example.progetto_kt.model.datasources.PreferencesController

class OrderRepository(
    private val apiController: APIController,
    private val dbController: DBController,
    private val preferencesController: PreferencesController
) {

    companion object {
        private val TAG = OrderRepository::class.simpleName
    }

    suspend fun getOrderDetails(sid : String, orderId : Int) : Order {
        return apiController.getOrderDetails(sid, orderId)
    }

    suspend fun buyMenu(sid : String, menuId : Int, deliveryLocation : Location) : Order {
        return apiController.orderMenu(sid, menuId, deliveryLocation)
    }


}