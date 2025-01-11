package com.example.progetto_kt.view.components.navigation

import android.annotation.SuppressLint
import android.util.Log
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Scaffold
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.lifecycle.compose.LocalLifecycleOwner
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import com.example.progetto_kt.view.components.common.other.BottomModal
import com.example.progetto_kt.view.components.common.other.handleErrorByType
import com.example.progetto_kt.view.components.navigation.navhosts.accountNavHost
import com.example.progetto_kt.view.components.navigation.navhosts.homeNavHost
import com.example.progetto_kt.view.components.navigation.navhosts.lastOrderNavHost
import com.example.progetto_kt.view.components.navigation.util.MyTabBar
import com.example.progetto_kt.view.components.navigation.util.NavigationPersistence
import com.example.progetto_kt.viewmodel.MainViewModel

@SuppressLint("RestrictedAPI")
@Composable
fun RootNavHost(
    viewModel: MainViewModel,
    onAskLocationPermission : () -> Unit
) {

    val TAG = "RootNavHost"
    val context = LocalContext.current

    val appState by viewModel.appState.collectAsState()
    var showTabBar by remember { mutableStateOf(true) }
    var currentRoute by remember { mutableStateOf<String?>(null) }

    val navController = rememberNavController()
    val navBackStackEntry by navController.currentBackStackEntryAsState()

    currentRoute = navBackStackEntry?.destination?.route

    LaunchedEffect(navBackStackEntry) {
        // Wait for the navigation animation to finish before updating showTabBar
        navController.currentBackStackEntry?.let { backStackEntry ->
            currentRoute = backStackEntry.destination.route
            showTabBar = AppScreen.values().firstOrNull { it.params.route == currentRoute }?.params?.showTabBar ?: true
        }
    }

    val lifecycleOwner = LocalLifecycleOwner.current

    NavigationPersistence(
        navController = navController,
        viewModel = viewModel,
        lifecycleOwner = lifecycleOwner
    )

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
                startDestination = AppScreen.HomeStack.params.route
            ) {

                homeNavHost(
                    navController = navController,
                    viewModel = viewModel
                )

                lastOrderNavHost(
                    navController = navController,
                    viewModel = viewModel)

                accountNavHost(
                    navController = navController,
                    viewModel = viewModel)

            }
        }

        val error = appState.error
        if (error != null) {
            Log.d("MainActivity", "With Error!")
            BottomModal(
                error = error,
                onAction = {
                    handleErrorByType(
                        error,
                        context,
                        navController,
                        onAskLocationPermission
                    )
                    viewModel.resetError()
                },
                onDismiss = { viewModel.resetError() }
            )
        }
    }

}

