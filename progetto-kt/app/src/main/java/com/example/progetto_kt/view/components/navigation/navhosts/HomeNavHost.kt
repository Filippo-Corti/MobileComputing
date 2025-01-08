package com.example.progetto_kt.view.navigation.navhosts

import android.util.Log
import androidx.compose.animation.core.tween
import androidx.compose.animation.slideIn
import androidx.compose.animation.slideOut
import androidx.compose.ui.unit.IntOffset
import androidx.navigation.NavController
import androidx.navigation.NavGraphBuilder
import androidx.navigation.compose.composable
import androidx.navigation.compose.navigation
import com.example.progetto_kt.view.components.screens.ConfirmOrderScreen
import com.example.progetto_kt.view.components.screens.HomeScreen
import com.example.progetto_kt.view.components.screens.MenuDetailsScreen
import com.example.progetto_kt.view.navigation.AppScreen
import com.example.progetto_kt.viewmodel.MainViewModel
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

fun NavGraphBuilder.homeNavHost(
    navController: NavController,
    viewModel: MainViewModel
) {

    navigation(
        startDestination = AppScreen.Home.params.route,
        route = AppScreen.HomeStack.params.route
    ) {

        composable(
            route = AppScreen.Home.params.route,
        ) {
            HomeScreen(
                viewModel = viewModel,
                onMenuClick = { menuId ->
                    navController.navigate(
                        AppScreen.MenuDetails.params.route.replace(
                            "{menuId}",
                            menuId.toString()
                        )
                    )
                }
            )
        }

        composable(
            route = AppScreen.MenuDetails.params.route,
            enterTransition = {
                slideIn(tween(400)) { IntOffset(it.width, 0) }
            },
            exitTransition = { null },
            popEnterTransition = { null },
            popExitTransition = {
                slideOut(tween(400)) { IntOffset(it.width, 0) }
            }
        ) { backStackEntry ->
            val menuId = backStackEntry.arguments?.getString("menuId")

            MenuDetailsScreen(
                viewModel = viewModel,
                menuId = menuId!!.toInt(),
                onForwardClick = {
                    navController.navigate(
                        AppScreen.ConfirmOrder.params.route.replace(
                            "{menuId}",
                            menuId.toString()
                        )
                    )
                },
                onBackClick = {
                    navController.navigateUp()
                }
            )
        }

        composable(
            route = AppScreen.ConfirmOrder.params.route,
            enterTransition = {
                slideIn(tween(400)) { IntOffset(it.width, 0) }
            },
            exitTransition = { null },
            popEnterTransition = { null },
            popExitTransition = {
                slideOut(tween(400)) { IntOffset(it.width, 0) }
            }
        ) { backStackEntry ->
            val menuId = backStackEntry.arguments?.getString("menuId")

            ConfirmOrderScreen(
                viewModel = viewModel,
                menuId = menuId!!.toInt(),
                onOrderClick = {
                    CoroutineScope(Dispatchers.Main).launch {
                        val success = viewModel.orderMenu(menuId.toInt())
                        if (success) {
                            Log.d("TAG", "Order placed successfully")
                            navController.navigate(AppScreen.LastOrder.params.route)
                        } else {
                            Log.d("TAG", "Error placing order")
                        }
                    }
                },
                onBackClick = {
                    navController.navigateUp()
                }
            )
        }
    }
}