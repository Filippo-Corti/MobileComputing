package com.example.navigation_app.components.navigation

import android.util.Log
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.BottomAppBar
import androidx.compose.material3.Scaffold
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.navigation.NavController
import androidx.navigation.NavHost
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.example.navigation_app.components.screens.AccountScreen
import com.example.navigation_app.components.screens.EditAccountScreen
import com.example.navigation_app.components.screens.HomeScreen
import com.example.navigation_app.components.screens.MenuDetailsScreen
import com.example.navigation_app.model.Menu


@Composable
fun AccountStack(
    tabController: NavController,
    selectedRoute: String, onSelectedRouteChange: (String) -> Unit,
    jumpToMenuDetails : (Menu) -> Unit
)
{

    val navController = rememberNavController()

    val navigateToRoute : (String) -> Unit = {  newRoute ->
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
    LaunchedEffect(selectedRoute) {
        Log.d("HomeStack", "Selected Route is $selectedRoute")
        navigateToRoute(selectedRoute)
    }

    Scaffold (
    ) { padding ->
        Box(
            modifier = Modifier.padding(padding)
        ) {
            NavHost(
                navController = navController,
                startDestination = NavigationItem.Account.route,
            ) {
                composable(NavigationItem.Account.route) {
                    AccountScreen(
                        handleNavigate = navigateToRoute,
                        handleNavigateToMenuDetails = { jumpToMenuDetails(Menu("Menu 1", "Description 1", "Long Description 1")) }
                    )
                }
                composable(NavigationItem.EditAccount.route) {
                    EditAccountScreen(
                        handleNavigateBack = navigateBack
                    )
                }
            }
        }
    }
}