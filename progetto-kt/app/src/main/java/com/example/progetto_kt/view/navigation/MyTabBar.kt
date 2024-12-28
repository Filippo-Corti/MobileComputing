package com.example.progetto_kt.view.navigation

import android.annotation.SuppressLint
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
                    if (currentRoute == targetRoute) return@NavigationBarItem

                    navController.navigate(item.params.route) {
                        popUpTo(0) {
                            saveState = true
                        }
                        launchSingleTop = true
                        restoreState = true
                    }
                },
            )
        }
    }
}