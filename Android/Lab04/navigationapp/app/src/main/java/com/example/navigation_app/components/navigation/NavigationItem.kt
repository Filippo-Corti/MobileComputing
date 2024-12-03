package com.example.navigation_app.components.navigation

import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.rounded.Home
import androidx.compose.material.icons.rounded.Info
import androidx.compose.material.icons.rounded.List
import androidx.compose.ui.graphics.vector.ImageVector

sealed class NavigationItem(var route: String, val icon: ImageVector, var title: String) {
    data object Home : NavigationItem("Home", Icons.Rounded.Home, "Home")
    data object Account : NavigationItem("Account", Icons.Rounded.Info, "Account")
}