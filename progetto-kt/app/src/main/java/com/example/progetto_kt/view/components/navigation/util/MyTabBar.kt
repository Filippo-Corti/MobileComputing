package com.example.progetto_kt.view.components.navigation.util

import android.annotation.SuppressLint
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Icon
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.NavigationBarItemColors
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.navigation.NavController
import androidx.navigation.compose.currentBackStackEntryAsState
import com.example.progetto_kt.view.components.common.icons.MyIcon
import com.example.progetto_kt.view.components.navigation.AppScreen
import com.example.progetto_kt.view.styles.Colors

@SuppressLint("RestrictedAPI")
@Composable
fun MyTabBar(
    navController: NavController
) {

    val navigationScreens = AppScreen.values().filter { it.params.showTabBar }

    NavigationBar(
        containerColor = Colors.WHITE,
        contentColor = Colors.BLACK,
    ) {

        val navBackStackEntry by navController.currentBackStackEntryAsState()
        val currentRoute = navBackStackEntry?.destination?.route

        navigationScreens.forEach { item ->

            NavigationBarItem(
                selected = currentRoute == item.params.route,
                modifier = Modifier.padding(0.dp, 6.dp, 0.dp, 0.dp),
                colors = NavigationBarItemColors(
                    selectedIconColor = Colors.BLACK,
                    unselectedIconColor = Colors.GRAY,
                    selectedTextColor = Colors.BLACK,
                    unselectedTextColor = Colors.GRAY,
                    selectedIndicatorColor = Colors.WHITE,
                    disabledIconColor = Colors.WHITE,
                    disabledTextColor = Colors.WHITE,
                ),

                label = {
                    Text(
                        text = item.params.title,
                        modifier = Modifier.offset(0.dp, (-5).dp),
                    )
                },
                icon = {
                    MyIcon(
                        name = item.params.iconName!!,
                        size = 34,
                        color = if (currentRoute == item.params.route) Colors.BLACK else Colors.GRAY,
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

@Preview
@Composable
fun MyTabBarPreview() {
    MyTabBar(navController = NavController(LocalContext.current))
}