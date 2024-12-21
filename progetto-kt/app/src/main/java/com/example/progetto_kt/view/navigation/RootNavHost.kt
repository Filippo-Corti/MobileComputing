package com.example.progetto_kt.view.navigation

import android.util.Log
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
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.IntOffset
import androidx.navigation.NavController
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
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

@Composable
fun RootNavHost(
    viewModel: MainViewModel,
) {

    var showTabBar by remember { mutableStateOf(true) }

    val navController = rememberNavController()
    val navBackStackEntry by navController.currentBackStackEntryAsState()

    val currentRoute = navBackStackEntry?.destination?.route
    showTabBar =
        AppScreen.values().firstOrNull { it.params.route == currentRoute }?.params?.showTabBar
            ?: true

    Scaffold(
        modifier = Modifier.fillMaxSize(),
        bottomBar = {
            if (showTabBar) {
                MyTabBar(navController)
            }
        }
    ) { paddingValues ->
        Box(
            modifier = Modifier
                .padding(paddingValues)
        ) {
            NavHost(
                navController = navController,
                startDestination = AppScreen.Home.params.route
            ) {

                homeNavHost(
                    navController = navController,
                    viewModel = viewModel
                )

                accountNavHost(
                    navController = navController,
                    viewModel = viewModel
                )

            }
        }
    }

}
