package com.example.navigation_app.components.navigation

import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.BottomAppBar
import androidx.compose.material3.Scaffold
import androidx.compose.runtime.Composable
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
import com.example.navigation_app.components.screens.HomeScreen
import com.example.navigation_app.components.screens.MenuDetailsScreen


@Composable
fun AccountStack(tabController: NavController) {

    val navController = rememberNavController()


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
                    AccountScreen()
                }
            }
        }
    }
}