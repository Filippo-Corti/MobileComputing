package com.example.progetto_kt.view.navigation

import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.rounded.Home
import androidx.compose.ui.graphics.vector.ImageVector

data class ScreenParams(
    val route : String,
    val icon : ImageVector? = null,
    val title : String,
    val showTabBar : Boolean = true
)

sealed class AppScreen(
    val params: ScreenParams
) {

    data object Home : AppScreen(
        ScreenParams(
            route = "home",
            icon = Icons.Rounded.Home,
            title = "Home"
        )
    )

    data object MenuDetails : AppScreen(
        ScreenParams(
            route = "menu_details/{menuId}",
            title = "Menu Details",
            showTabBar = false
        )
    )

    data object ConfirmOrder : AppScreen(
        ScreenParams(
            route = "confirm_order",
            title = "Confirm Order",
            showTabBar = false
        )
    )

    companion object {
        fun values(): List<AppScreen> = listOf(
            Home,
            MenuDetails,
            ConfirmOrder
        )
    }

}