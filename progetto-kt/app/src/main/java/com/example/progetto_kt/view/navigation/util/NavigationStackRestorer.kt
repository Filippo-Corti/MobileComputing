package com.example.progetto_kt.view.navigation.util

import android.annotation.SuppressLint
import android.util.Log
import androidx.compose.runtime.Composable
import androidx.compose.runtime.DisposableEffect
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.lifecycle.Lifecycle
import androidx.lifecycle.LifecycleEventObserver
import androidx.lifecycle.LifecycleOwner
import androidx.lifecycle.compose.LocalLifecycleOwner
import androidx.navigation.NavController
import androidx.navigation.compose.currentBackStackEntryAsState
import com.example.progetto_kt.view.navigation.AppScreen
import com.example.progetto_kt.viewmodel.MainViewModel
import kotlinx.coroutines.runBlocking

val TAG = "NavigationStackRestorer"

@SuppressLint("RestrictedAPI")
fun buildNavigationStackString(controller: NavController): String {
    val stack = controller.currentBackStack.value.filter { it.destination.route != null }

    val stackAsString = stack.map {
        var route = it.destination.route
        val params = it.arguments

        for (param in params?.keySet() ?: emptySet()) {
            if (route?.contains("{$param}") == true) {
                val value = params?.getString(param)
                route = route.replace("{$param}", value ?: "")
            }
        }
        route
    }.joinToString(";")

    Log.d(TAG, "Saving current Stack as: $stackAsString")

    return stackAsString
}

@Composable
fun NavigationStackRestorer(
    navController: NavController,
    viewModel: MainViewModel,
    lifecycleOwner: LifecycleOwner = LocalLifecycleOwner.current
) {

    val navBackStackEntry by navController.currentBackStackEntryAsState()
    val currentRoute = navBackStackEntry?.destination?.route

    val isRestored = remember { mutableStateOf(false) }

    // Restore the previous navigation stack on first composition
    LaunchedEffect(isRestored.value) {
        if (isRestored.value) return@LaunchedEffect
        val lastStack = viewModel.getLastNavigationStack()

        Log.d(TAG, "Last screen was $lastStack")
        if (!lastStack.isNullOrEmpty()) {
            navController.popBackStack(AppScreen.HomeStack.params.route, true)
            lastStack.split(";").forEach { route ->
                navController.navigate(route) {
                    launchSingleTop = true
                    restoreState = true
                }
            }
        }
        isRestored.value = true
    }

    // Save the current navigation stack on ON_STOP event
    DisposableEffect(lifecycleOwner) {
        val observer = LifecycleEventObserver { _, event ->
            if (event == Lifecycle.Event.ON_STOP) {
                val stack = buildNavigationStackString(navController)
                Log.d(TAG, "Lifecycle stopped, last stack was $stack")
                runBlocking {
                    viewModel.saveNavigationStack(stack)
                }
            }
        }

        lifecycleOwner.lifecycle.addObserver(observer)

        onDispose {
            lifecycleOwner.lifecycle.removeObserver(observer)
        }
    }
}

