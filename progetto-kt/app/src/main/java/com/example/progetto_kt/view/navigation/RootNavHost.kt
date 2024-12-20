package com.example.progetto_kt.view.navigation

import androidx.compose.animation.core.tween
import androidx.compose.animation.slideIn
import androidx.compose.animation.slideOut
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Scaffold
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.IntOffset
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import com.example.progetto_kt.view.components.screens.AccountScreen
import com.example.progetto_kt.view.components.screens.AddEditAccountScreen
import com.example.progetto_kt.view.components.screens.ConfirmOrderScreen
import com.example.progetto_kt.view.components.screens.HomeScreen
import com.example.progetto_kt.view.components.screens.MenuDetailsScreen
import com.example.progetto_kt.viewmodel.MainViewModel

@Composable
fun RootNavHost(
    viewModel: MainViewModel,
) {

    var showTabBar by remember { mutableStateOf(true) }

    val navController = rememberNavController()
    val navBackStackEntry by navController.currentBackStackEntryAsState()

    val currentRoute = navBackStackEntry?.destination?.route
    showTabBar = AppScreen.values().firstOrNull { it.params.route == currentRoute }?.params?.showTabBar ?: true


    Scaffold (
        modifier = Modifier.fillMaxSize(),
        bottomBar = {
            if (showTabBar) {
                MyTabBar(navController)
            }
        }
    ){ paddingValues ->
        Box(
            modifier = Modifier
                .padding(paddingValues)
        ) {
            NavHost(
                navController = navController,
                startDestination = AppScreen.Home.params.route
            ) {

                composable(
                    route = AppScreen.Home.params.route,
                ) {
                    HomeScreen(
                        viewModel = viewModel,
                        onMenuClick = { menuId ->
                            navController.navigate(AppScreen.MenuDetails.params.route.replace("{menuId}", menuId.toString()))
                        }
                    )
                }

                composable(
                    route = AppScreen.MenuDetails.params.route,
                    enterTransition = {
                        slideIn(tween(700)) { IntOffset(it.width, 0) }
                    },
                    exitTransition = { null },
                    popEnterTransition = { null },
                    popExitTransition = {
                        slideOut(tween(700)) { IntOffset(it.width, 0) }
                    }
                ) { backStackEntry ->
                    val menuId = backStackEntry.arguments?.getString("menuId")
                    MenuDetailsScreen(
                        viewModel = viewModel,
                        menuId = menuId!!.toInt(),
                        onForwardClick = { menuId ->
                            navController.navigate(AppScreen.ConfirmOrder.params.route.replace("{menuId}", menuId.toString()))
                        },
                        onBackClick = {
                            navController.navigateUp()
                        }
                    )
                }

                composable(
                    route = AppScreen.ConfirmOrder.params.route,
                    enterTransition = {
                        slideIn(tween(700)) { IntOffset(it.width, 0) }
                    },
                    exitTransition = { null },
                    popEnterTransition = { null },
                    popExitTransition = {
                        slideOut(tween(700)) { IntOffset(it.width, 0) }
                    }
                ) { backStackEntry ->
                    val menuId = backStackEntry.arguments?.getString("menuId")
                    val menuIdInt = menuId!!.toInt()
                    ConfirmOrderScreen(
                        viewModel = viewModel,
                        menuId = menuIdInt,
                        onOrderClick = {
                            viewModel.buyMenu(menuIdInt)
                            navController.navigate(AppScreen.Home.params.route)
                            true to "Ok"
                        },
                        onBackClick = {
                            navController.navigateUp()
                        }
                    )
                }

                composable(
                    route = AppScreen.Account.params.route,
                ) {

                    AccountScreen(
                        viewModel = viewModel,
                        onEditAccountClick = { newAccount ->
                            navController.navigate(AppScreen.AddEditAccount.params.route.replace("{newAccount}", newAccount.toString()))
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
        }
    }

}