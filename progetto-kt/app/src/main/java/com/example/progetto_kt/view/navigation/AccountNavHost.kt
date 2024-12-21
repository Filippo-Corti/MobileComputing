package com.example.progetto_kt.view.navigation

import androidx.compose.animation.core.tween
import androidx.compose.animation.slideIn
import androidx.compose.animation.slideOut
import androidx.compose.ui.unit.IntOffset
import androidx.navigation.NavController
import androidx.navigation.NavGraphBuilder
import androidx.navigation.compose.composable
import com.example.progetto_kt.view.components.screens.AccountScreen
import com.example.progetto_kt.view.components.screens.AddEditAccountScreen
import com.example.progetto_kt.viewmodel.MainViewModel

fun NavGraphBuilder.accountNavHost(
    navController: NavController,
    viewModel: MainViewModel,
) {

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
            }
        )
    }

    composable(
        route = AppScreen.AddEditAccount.params.route,
        enterTransition = {
            slideIn(tween(700)) { IntOffset(it.width, 0) }
        },
        exitTransition = { null },
        popEnterTransition = { null },
        popExitTransition = {
            slideOut(tween(700)) { IntOffset(it.width, 0) }
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