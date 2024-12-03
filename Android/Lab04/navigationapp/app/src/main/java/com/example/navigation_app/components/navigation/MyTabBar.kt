package com.example.navigation_app.components.navigation

import androidx.compose.material3.Icon
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.navigation.NavController

@Composable
fun MyTabBar(
    navController: NavController
) {

    val items = listOf(
        NavigationItem.HomeStack, // 0
        NavigationItem.AccountStack // 1
    )

    var selectedItem by remember { mutableIntStateOf(0) }
    var currentRoute by remember { mutableStateOf(items[selectedItem].route) }


    NavigationBar {
        items.forEachIndexed { index, item ->
            NavigationBarItem(
                alwaysShowLabel = true,
                icon = { item.icon?.let { Icon(it, contentDescription = item.title) } },
                label = { Text(item.title) },
                selected = selectedItem  == index,
                onClick = {
                    selectedItem = index
                    currentRoute = item.route

                    navController.navigate(item.route) {
                        popUpTo(item.route) {
                            inclusive = true
                        }
                        launchSingleTop = true
                    }
                }
            )
        }
    }



}