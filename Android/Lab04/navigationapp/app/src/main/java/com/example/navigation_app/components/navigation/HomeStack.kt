package com.example.navigation_app.components.navigation

import android.util.Log
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.BottomAppBar
import androidx.compose.material3.Scaffold
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.navigation.NavController
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import com.example.navigation_app.components.screens.HomeScreen
import com.example.navigation_app.components.screens.MenuDetailsScreen
import com.example.navigation_app.model.Menu


@Composable
fun HomeStack(
    tabController: NavController,
    selectedRoute: String,
    selectedRouteParams : Map<String, Any>?,
    onSelectedRouteChange: (String) -> Unit
) {

    val navController = rememberNavController()

    val navigateToRoute : (String) -> Unit = { newRoute ->
        onSelectedRouteChange(newRoute)
        navController.navigate(newRoute) {
            launchSingleTop = true
        }
    }

    val navigateBack : () -> Unit = navigateBack@{
        if (navController.popBackStack()) {
            val previousRoute = navController.currentBackStackEntry?.destination?.route
            if (previousRoute != null) {
                onSelectedRouteChange(previousRoute)
            }
        } else {
            Log.d("HomeStack", "No back stack entry to pop")
        }
    }

    // Navigate to the last selected route when HomeStack is selected
    LaunchedEffect(selectedRoute, selectedRouteParams) {
        Log.d("HomeStack", "Selected Route is $selectedRoute")
        selectedRouteParams?.forEach() { (key, value) ->
            navController.currentBackStackEntry?.savedStateHandle?.set(key, value)
        }
        navigateToRoute(selectedRoute)
    }

    Scaffold (
    ) { padding ->
        Box(
            modifier = Modifier.padding(padding)
        ) {
            NavHost(
                navController = navController,
                startDestination = NavigationItem.Home.route,
            ) {
                composable(NavigationItem.Home.route) {
                    HomeScreen(
                        handleNavigate = navigateToRoute,
                        handleNavigateToMenuDetails = { menu ->
                            navController.currentBackStackEntry?.savedStateHandle?.set("menu", menu)
                            navigateToRoute(NavigationItem.MenuDetails.route)
                        }
                    )
                }
                composable(NavigationItem.MenuDetails.route) {
                    val menu : Menu? = navController.previousBackStackEntry?.savedStateHandle?.get("menu")
                    if (menu != null) {
                        MenuDetailsScreen(
                            navController = navController,
                            menu = menu,
                            handleNavigateBack = navigateBack,
                        )
                    }
                }
            }
        }
    }
}