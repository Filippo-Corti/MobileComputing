package com.example.progetto_kt.view.components.navigation

import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.rounded.AccountCircle
import androidx.compose.material.icons.rounded.Home
import androidx.compose.material.icons.rounded.ShoppingCart
import androidx.compose.ui.graphics.vector.ImageVector
import com.example.progetto_kt.view.components.common.icons.IconNames

data class ScreenParams(
    val route : String,
    val iconName : IconNames? = null,
    val title : String,
    val showTabBar : Boolean = true,
    val stackName : String,
)

sealed class AppScreen(
    val params: ScreenParams
) {

    data object HomeStack : AppScreen(
        ScreenParams(
            route = "home_stack",
            title = "Home",
            showTabBar = false,
            stackName = "home_stack"
        )
    )

    data object Home : AppScreen(
        ScreenParams(
            route = "home",
            iconName = IconNames.HOME,
            title = "Home",
            stackName = "home_stack"
        )
    )

    data object MenuDetails : AppScreen(
        ScreenParams(
            route = "menu_details/{menuId}",
            title = "Menu Details",
            showTabBar = false,
            stackName = "home_stack"
        )
    )

    data object ConfirmOrder : AppScreen(
        ScreenParams(
            route = "confirm_order/{menuId}",
            title = "Confirm Order",
            showTabBar = false,
            stackName = "home_stack"
        )
    )

    data object MenuIngredients : AppScreen(
        ScreenParams(
            route = "confirm_order/{menuId}",
            title = "Menu Ingredients",
            showTabBar = false,
            stackName = "home_stack"
        )
    )

    data object AccountStack : AppScreen(
        ScreenParams(
            route = "account_stack",
            title = "Account",
            showTabBar = false,
            stackName = "account_stack"
        )
    )

    data object Account : AppScreen(
        ScreenParams(
            route = "account",
            iconName = IconNames.USER,
            title = "Account",
            stackName = "account_stack"
        )
    )

    data object AddEditAccount : AppScreen(
        ScreenParams(
            route = "add_edit_account/{newAccount}",
            title = "Add/Edit Account",
            showTabBar = false,
            stackName = "account_stack"
        )
    )

    data object LastOrderStack : AppScreen(
        ScreenParams(
            route = "last_order_stack",
            title = "Last Order",
            showTabBar = false,
            stackName = "last_order_stack"
        )
    )

    data object LastOrder : AppScreen(
        ScreenParams(
            route = "last_order",
            iconName = IconNames.SHOPPING_BAG,
            title = "Last Order",
            stackName = "last_order_stack"
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
            MenuIngredients,
            AddEditAccount,
        )

        fun isValidRoute(route: String): Boolean {
            val routeWithoutParams = route.split("/").first()
            return values().any { it.params.route.startsWith(routeWithoutParams) }
        }

        fun getStack(route: String): String? {
            val routeWithoutParams = route.split("/").first()
            return values().firstOrNull { it.params.route.startsWith(routeWithoutParams) }?.params?.stackName
        }
    }

}