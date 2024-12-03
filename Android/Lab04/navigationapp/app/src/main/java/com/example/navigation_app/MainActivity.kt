package com.example.navigation_app

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.BottomAppBar
import androidx.compose.material3.Button
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import androidx.navigation.navigation
import com.example.navigation_app.components.navigation.AccountStack
import com.example.navigation_app.components.navigation.HomeStack
import com.example.navigation_app.components.navigation.MyTabBar
import com.example.navigation_app.components.navigation.NavigationItem
import com.example.navigation_app.components.screens.AccountScreen
import com.example.navigation_app.components.screens.HomeScreen
import com.example.navigation_app.components.screens.MenuDetailsScreen

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            val tabController = rememberNavController()

            var homeStackSelectedRoute by remember { mutableStateOf(NavigationItem.Home.route) }

            Scaffold (
                bottomBar = {
                    BottomAppBar {
                        MyTabBar(
                            navController = tabController,
                        )
                    }
                }
            ) { padding ->
                Box(
                    modifier = Modifier.padding(padding)
                ) {
                    NavHost(
                        navController = tabController,
                        startDestination = NavigationItem.HomeStack.route,
                    ) {
                        composable(NavigationItem.HomeStack.route) {
                            HomeStack(
                                tabController = tabController,
                                selectedRoute = homeStackSelectedRoute,
                                onSelectedRouteChange = { route -> homeStackSelectedRoute = route }
                            )
                        }
                        composable(NavigationItem.AccountStack.route) {
                            AccountStack(
                                tabController = tabController,
                            )
                        }
                    }
                }
            }
        }
    }
}