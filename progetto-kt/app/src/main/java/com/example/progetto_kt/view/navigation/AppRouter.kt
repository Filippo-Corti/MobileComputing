package com.example.progetto_kt.view.navigation

import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.rounded.AccountCircle
import androidx.compose.material.icons.rounded.Home
import androidx.compose.material.icons.rounded.ShoppingCart
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

    data object HomeStack : AppScreen(
        ScreenParams(
            route = "home_stack",
            title = "Home",
            showTabBar = false
        )
    )

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
            route = "confirm_order/{menuId}",
            title = "Confirm Order",
            showTabBar = false
        )
    )

    data object AccountStack : AppScreen(
        ScreenParams(
            route = "account_stack",
            title = "Account",
            showTabBar = false
        )
    )

    data object Account : AppScreen(
        ScreenParams(
            route = "account",
            icon = Icons.Rounded.AccountCircle,
            title = "Account"
        )
    )

    data object AddEditAccount : AppScreen(
        ScreenParams(
            route = "add_edit_account/{newAccount}",
            title = "Add/Edit Account",
            showTabBar = false
        )
    )

    data object LastOrderStack : AppScreen(
        ScreenParams(
            route = "last_order_stack",
            title = "Last Order",
            showTabBar = false
        )
    )

    data object LastOrder : AppScreen(
        ScreenParams(
            route = "last_order",
            icon = Icons.Rounded.ShoppingCart,
            title = "Last Order",
        )
    )

    companion object {
        fun values(): List<AppScreen> = listOf(
            HomeStack,
            AccountStack,
            LastOrderStack,
            Home,
            LastOrder,
            Account,
            MenuDetails,
            ConfirmOrder,
            AddEditAccount,
        )
    }

}