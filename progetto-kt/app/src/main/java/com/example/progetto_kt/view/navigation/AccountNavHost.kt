package com.example.progetto_kt.view.navigation

import androidx.compose.animation.core.tween
import androidx.compose.animation.slideIn
import androidx.compose.animation.slideOut
import androidx.compose.ui.unit.IntOffset
import androidx.navigation.NavController
import androidx.navigation.NavGraphBuilder
import androidx.navigation.compose.composable
import androidx.navigation.compose.navigation
import com.example.progetto_kt.view.components.screens.AccountScreen
import com.example.progetto_kt.view.components.screens.AddEditAccountScreen
import com.example.progetto_kt.viewmodel.MainViewModel

fun NavGraphBuilder.accountNavHost(
    navController: NavController,
    viewModel: MainViewModel,
) {

    navigation(
        startDestination = AppScreen.Account.params.route,
        route = AppScreen.AccountStack.params.route
    )
    {
        composable(
            route = AppScreen.Account.params.route,
        ) {
            AccountScreen(
                viewModel = viewModel,
                onEditAccountClick = { newAccount ->
                    navController.navigate(
                        AppScreen.AddEditAccount.params.route.replace(
                            "{newAccount}",
                            newAccount.toString()
                        )
                    )
                },
                onOrderAgainClick = { menuId ->
                    navController.navigate(
                        AppScreen.MenuDetails.params.route.replace(
                            "{menuId}",
                            menuId.toString()
                        )
                    )
                },
                onCheckLastOrderClick = {
                    navController.navigate(AppScreen.LastOrder.params.route)
                }
            )
        }

        composable(
            route = AppScreen.AddEditAccount.params.route,
            enterTransition = {
                slideIn(tween(400)) { IntOffset(it.width, 0) }
            },
            exitTransition = { null },
            popEnterTransition = { null },
            popExitTransition = {
                slideOut(tween(400)) { IntOffset(it.width, 0) }
            }
        ) { backStackEntry ->
            val newAccount = backStackEntry.arguments?.getString("newAccount")

            AddEditAccountScreen(
                viewModel = viewModel,
                newAccount = newAccount!!.toBoolean(),
                onBackClick = {
                    navController.navigateUp()
                }
            )
        }
    }
}