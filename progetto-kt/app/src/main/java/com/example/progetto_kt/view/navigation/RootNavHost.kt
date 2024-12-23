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
import androidx.compose.runtime.DisposableEffect
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.IntOffset
import androidx.lifecycle.Lifecycle
import androidx.lifecycle.LifecycleEventObserver
import androidx.lifecycle.compose.LocalLifecycleOwner
import androidx.navigation.NavController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import com.example.progetto_kt.view.components.screens.AccountScreen
import com.example.progetto_kt.view.components.screens.AddEditAccountScreen
import com.example.progetto_kt.view.components.screens.ConfirmOrderScreen
import com.example.progetto_kt.view.components.screens.HomeScreen
import com.example.progetto_kt.view.components.screens.LastOrderScreen
import com.example.progetto_kt.view.components.screens.MenuDetailsScreen
import com.example.progetto_kt.viewmodel.MainViewModel
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

@Composable
fun RootNavHost(
    viewModel: MainViewModel,
) {

    val TAG = "RootNavHost"

    var showTabBar by remember { mutableStateOf(true) }
    var currentStack by remember { mutableStateOf<String?>(null) }
    var currentRoute by remember { mutableStateOf<String?>(null) }

    val navController = rememberNavController()
    val navBackStackEntry by navController.currentBackStackEntryAsState()

    currentRoute = navBackStackEntry?.destination?.route
    if (currentRoute != null)
        currentStack = AppScreen.getStack(currentRoute!!)

    showTabBar = AppScreen.values().firstOrNull { it.params.route == currentRoute }?.params?.showTabBar ?: true

    val lifecycleOwner = LocalLifecycleOwner.current

    LaunchedEffect(Unit) {
        val lastScreen = viewModel.getLastScreen()

        Log.d(TAG, "Restoring last screen $lastScreen")

        if (lastScreen != null && AppScreen.isValidRoute(lastScreen)) {
            currentStack = AppScreen.getStack(lastScreen)
        }

        currentStack?.let { navController.navigate(it) }
        lastScreen?.let { navController.navigate(it) }
    }

    DisposableEffect(lifecycleOwner) {
        val observer = LifecycleEventObserver { _, event ->
            if (event == Lifecycle.Event.ON_STOP) {
                var routeToSave = currentRoute

                // Extract parameters from the latest navBackStackEntry
                for (param in navBackStackEntry?.arguments?.keySet() ?: emptySet()) {
                    if (routeToSave?.contains("{$param}") == true) {
                        val value = navBackStackEntry?.arguments?.getString(param)
                        routeToSave = routeToSave.replace("{$param}", value ?: "")
                    }
                }

                Log.d(TAG, "Lifecycle stopped, last screen was $routeToSave")
                if (routeToSave != null) {
                    CoroutineScope(Dispatchers.Main).launch {
                        viewModel.saveLastScreen(routeToSave)
                        Log.d(TAG, "Saved last screen $routeToSave")
                    }
                }
            }
        }

        lifecycleOwner.lifecycle.addObserver(observer)

        onDispose {
            lifecycleOwner.lifecycle.removeObserver(observer)
        }
    }

    Log.d(TAG, "Current route: $currentStack - $currentRoute")

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
                startDestination = currentStack ?: AppScreen.HomeStack.params.route
            ) {

                homeNavHost(
                    navController = navController,
                    viewModel = viewModel
                )

                lastOrderNavHost(
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
