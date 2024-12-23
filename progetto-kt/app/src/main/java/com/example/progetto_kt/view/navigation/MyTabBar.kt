package com.example.progetto_kt.view.navigation

import android.annotation.SuppressLint
import android.util.Log
import androidx.compose.material3.Icon
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.navigation.NavController
import androidx.navigation.NavGraph.Companion.findStartDestination
import androidx.navigation.compose.currentBackStackEntryAsState

@SuppressLint("RestrictedAPI")
@Composable
fun MyTabBar(
    navController: NavController
) {

    val navigationScreen = AppScreen.values().filter { it.params.showTabBar }

    NavigationBar {

        val navBackStackEntry by navController.currentBackStackEntryAsState()
        val currentRoute = navBackStackEntry?.destination?.route

        navigationScreen.forEach { item ->

            NavigationBarItem(
                selected = currentRoute == item.params.route,

                label = {
                      Text(
                        text = item.params.title
                      )
                },
                icon = {
                    Icon(
                        imageVector = (item.params.icon!!),
                        contentDescription = item.params.title
                    )
                },

                onClick = {
                    val targetRoute = item.params.route

                    Log.d("MyTabBar", "Current Route: $currentRoute")
                    Log.d("MyTabBar", "Target Route: $targetRoute")
                    Log.d("MyTabBar", "Stack currently is: ${navController.currentBackStack.value}")
                    Log.d("MyTabBar", "Start Destination Id: ${navController.graph.startDestinationId}")

                    if (currentRoute != targetRoute) {

                        // Iterate over the back stack and pop until we reach the target route
                        for (entry in navController.currentBackStack.value) {
                            Log.d("MyTabBar", "Checking entry: ${entry.destination.route}")
                            if (entry.destination.route == targetRoute) {
                                break
                            }
                            // Remove the entry from the stack
                            navController.popBackStack()
                        }

                        navController.navigate(item.params.route) {
                            launchSingleTop = true
                        }
                    }
                },
            )
        }
    }
}