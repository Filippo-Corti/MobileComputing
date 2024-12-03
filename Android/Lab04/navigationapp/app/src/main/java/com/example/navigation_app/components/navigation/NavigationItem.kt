package com.example.navigation_app.components.navigation

import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.rounded.AccountBox
import androidx.compose.material.icons.rounded.Home
import androidx.compose.material.icons.rounded.Info
import androidx.compose.material.icons.rounded.List
import androidx.compose.ui.graphics.vector.ImageVector

sealed class NavigationItem(var route: String, val icon: ImageVector?, var title: String) {
    data object HomeStack : NavigationItem("HomeStack", Icons.Rounded.Home, "Home")
    data object Home : NavigationItem("Home", null, "Home")
    data object MenuDetails : NavigationItem("MenuDetails", null, "MenuDetails")

    data object AccountStack : NavigationItem("AccountStack", Icons.Rounded.AccountBox, "Account")
    data object Account : NavigationItem("Account", null, "Account")
}