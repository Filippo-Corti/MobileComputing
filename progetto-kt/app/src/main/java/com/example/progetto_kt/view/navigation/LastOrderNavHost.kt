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
import com.example.progetto_kt.view.components.screens.LastOrderScreen
import com.example.progetto_kt.viewmodel.MainViewModel

fun NavGraphBuilder.lastOrderNavHost(
    navController: NavController,
    viewModel: MainViewModel,
) {

    navigation(
        startDestination = AppScreen.LastOrder.params.route,
        route = AppScreen.LastOrderStack.params.route
    )
    {
        composable(
            route = AppScreen.LastOrder.params.route
        ) {
            LastOrderScreen(
                viewModel = viewModel
            )
        }
    }
}