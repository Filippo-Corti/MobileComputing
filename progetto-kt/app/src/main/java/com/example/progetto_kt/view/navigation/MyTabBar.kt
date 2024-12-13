package com.example.progetto_kt.view.navigation

import androidx.compose.material3.Icon
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.navigation.NavController
import androidx.navigation.NavGraph.Companion.findStartDestination
import androidx.navigation.compose.currentBackStackEntryAsState

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
                    navController.navigate(item.params.route) {
                        popUpTo(navController.graph.findStartDestination().id) {
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