package com.example.progetto_kt.view.navigation

import android.annotation.SuppressLint
import android.app.Activity
import android.os.Bundle
import android.util.Log
import androidx.compose.animation.core.tween
import androidx.compose.animation.slideIn
import androidx.compose.animation.slideOut
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Button
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.ModalBottomSheet
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.rememberModalBottomSheetState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.DisposableEffect
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.IntOffset
import androidx.lifecycle.Lifecycle
import androidx.lifecycle.LifecycleEventObserver
import androidx.lifecycle.compose.LocalLifecycleOwner
import androidx.navigation.NavController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import com.example.progetto_kt.model.dataclasses.Error
import com.example.progetto_kt.model.dataclasses.ErrorType
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
import kotlinx.coroutines.runBlocking

@SuppressLint("RestrictedAPI")
fun buildNavigationStackString(controller : NavController) : String {
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

    Log.d("RootNavHost", "Saving current Stack as: $stackAsString")

    return stackAsString
}

@Composable
fun RootNavHost(
    viewModel: MainViewModel,
) {

    val TAG = "RootNavHost"
    val context = LocalContext.current

    val state by viewModel.uiState.collectAsState()
    val error = state.error
    var showBottomSheet = error != null
    var showTabBar by remember { mutableStateOf(true) }
    var currentRoute by remember { mutableStateOf<String?>(null) }

    val navController = rememberNavController()
    val navBackStackEntry by navController.currentBackStackEntryAsState()

    currentRoute = navBackStackEntry?.destination?.route

    showTabBar = AppScreen.values().firstOrNull { it.params.route == currentRoute }?.params?.showTabBar ?: true

    val lifecycleOwner = LocalLifecycleOwner.current


    LaunchedEffect(Unit) {
        val lastStack= viewModel.getLastNavigationStack()

        Log.d(TAG, "Last screen was $lastStack")
        lastStack?.let {
            it.split(";").forEach { route ->
                navController.navigate(route)
            }
        }
    }

    DisposableEffect(lifecycleOwner) {
        val observer = LifecycleEventObserver { _, event ->
            if (event == Lifecycle.Event.ON_STOP) {
                Log.d(TAG, "Lifecycle stopped, last screen was $currentRoute")
                val stack = buildNavigationStackString(navController)
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

        if (showBottomSheet) {
            Log.d("MainActivity", "With Error!")
            ErrorModal(
                error = error!!,
                onAction = {
                    viewModel.resetError()
                    when (error.type) {
                        ErrorType.NETWORK -> {
                            // Reload the Activity
                            Log.d(TAG, "Network Error")
                            if (context is Activity) {
                                context.finish()
                                context.startActivity(context.intent)
                            }
                        }
                        ErrorType.ACCOUNT_DETAILS -> {
                            // Navigate to Account
                            Log.d(TAG, "Account Error")
                            navController.navigate(AppScreen.AccountStack.params.route)
                        }
                        ErrorType.POSITION_UNALLOWED -> {
                            // Ask for Position
                            Log.d(TAG, "Position Error")
                        }
                        else -> {}
                    }
                    showBottomSheet = false
                },
                onDismiss = {
                    viewModel.resetError()
                    showBottomSheet = false
                    Log.d(TAG, "Bottom Sheet Dismissed")
                }
            )
        }
    }

}


@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ErrorModal(
    error: Error,
    onAction : () -> Unit,
    onDismiss: () -> Unit
) {
    val sheetState = rememberModalBottomSheetState()
    val scope = rememberCoroutineScope()

    ModalBottomSheet(
        onDismissRequest = onDismiss,
        sheetState = sheetState
    ) {
        Column {
            Text(
                text = "Title: ${error.title}",
            )

            Text(
                text = "Message: ${error.message}",
            )

            if (error.actionText != null) {
                Button(
                    onClick = {
                        scope.launch { sheetState.hide() }.invokeOnCompletion {
                            onAction()
                        }
                    }
                ) {
                    Text(
                        text = error.actionText,
                    )
                }
            }

            Button(
                onClick = {
                    scope.launch { sheetState.hide() }.invokeOnCompletion {
                        onDismiss()
                    }
                }
            ) {
                Text(
                    text = error.dismissText,
                )
            }
        }
    }
}
