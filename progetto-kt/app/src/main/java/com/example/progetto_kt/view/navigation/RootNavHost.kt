package com.example.progetto_kt.view.navigation

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
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.dialog
import androidx.navigation.compose.navigation
import androidx.navigation.compose.rememberNavController
import com.example.progetto_kt.view.components.screens.HomeScreen
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
                //MyTabBar()
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
                    route = AppScreen.Home.params.route
                ) {
                    HomeScreen(
                        viewModel = viewModel,
                        onMenuClick = {
                            navController.navigate(AppScreen.MenuDetails.params.route)
                        }
                    )
                }

                /*dialog(
                    route = AppScreen.MenuDetails.params.route
                ) {
                    MenuDetailsScreen(
                        onConfirmOrderClick = {
                            navController.navigate(AppScreen.ConfirmOrder.params.route)
                        },
                        onBackClick = {
                            navController.navigateUp()
                        }
                    )
                }*/

            }
        }
    }

}