package com.example.progetto_kt.view.components.common.icons

import androidx.compose.foundation.layout.size
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.automirrored.filled.ArrowForward
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.CreditCard
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.KeyboardArrowDown
import androidx.compose.material.icons.filled.LocationOn
import androidx.compose.material.icons.filled.Memory
import androidx.compose.material.icons.filled.Money
import androidx.compose.material.icons.filled.NearMe
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.Restaurant
import androidx.compose.material.icons.filled.Sell
import androidx.compose.material.icons.filled.ShoppingBag
import androidx.compose.material.icons.outlined.Timer
import androidx.compose.material3.Icon
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp

enum class IconNames {
    HOME,
    SHOPPING_BAG,
    USER,
    CREDIT_CARD,
    CLOCK,
    FOOD,
    ARROW_DOWN,
    ARROW_LEFT,
    ARROW_RIGHT,
    PRICE_TAG,
    MARKER,
    NAVIGATOR,
    CC_CHIP,
    VISA,
    CROSS
}

@Composable
fun MyIcon(
    name : IconNames,
    size : Int = 24,
    color : Color
) {
    when(name) {
        IconNames.HOME -> Icon(
            modifier = Modifier
                .size(size.dp),
            imageVector = Icons.Filled.Home,
            contentDescription = "Home",
            tint = color
        )
        IconNames.SHOPPING_BAG -> Icon(
            modifier = Modifier
                .size(size.dp),
            imageVector = Icons.Filled.ShoppingBag,
            contentDescription = "Shopping Bag",
            tint = color
        )
        IconNames.USER -> Icon(
            modifier = Modifier
                .size(size.dp),
            imageVector = Icons.Filled.Person,
            contentDescription = "User",
            tint = color
        )
        IconNames.CREDIT_CARD -> Icon(
            modifier = Modifier
                .size(size.dp),
            imageVector = Icons.Filled.CreditCard,
            contentDescription = "Credit Card",
            tint = color
        )
        IconNames.CLOCK -> Icon(
            modifier = Modifier
                .size(size.dp),
            imageVector = Icons.Outlined.Timer,
            contentDescription = "Clock",
            tint = color
        )
        IconNames.FOOD -> Icon(
            modifier = Modifier
                .size(size.dp),
            imageVector = Icons.Filled.Restaurant,
            contentDescription = "Food",
            tint = color
        )
        IconNames.ARROW_DOWN -> Icon(
            modifier = Modifier
                .size(size.dp),
            imageVector = Icons.Filled.KeyboardArrowDown,
            contentDescription = "Arrow Down",
            tint = color
        )
        IconNames.ARROW_LEFT -> Icon(
            modifier = Modifier
                .size(size.dp),
            imageVector = Icons.AutoMirrored.Filled.ArrowBack,
            contentDescription = "Arrow Left",
            tint = color
        )
        IconNames.ARROW_RIGHT -> Icon(
            modifier = Modifier
                .size(size.dp),
            imageVector = Icons.AutoMirrored.Filled.ArrowForward,
            contentDescription = "Arrow Right",
            tint = color
        )
        IconNames.PRICE_TAG -> Icon(
            modifier = Modifier
                .size(size.dp),
            imageVector = Icons.Filled.Sell,
            contentDescription = "Price Tag",
            tint = color
        )
        IconNames.MARKER -> Icon(
            modifier = Modifier
                .size(size.dp),
            imageVector = Icons.Filled.LocationOn,
            contentDescription = "Marker",
            tint = color
        )
        IconNames.NAVIGATOR -> Icon(
            modifier = Modifier
                .size(size.dp),
            imageVector = Icons.Filled.NearMe,
            contentDescription = "Navigator",
            tint = color
        )
        IconNames.CC_CHIP -> Icon(
            modifier = Modifier
                .size(size.dp),
            imageVector = Icons.Filled.Memory,
            contentDescription = "CC Chip",
            tint = color
        )
        IconNames.VISA -> Icon(
            modifier = Modifier
                .size(size.dp),
            imageVector = Icons.Filled.Money,
            contentDescription = "Visa",
            tint = color
        )
        IconNames.CROSS -> Icon(
            modifier = Modifier
                .size(size.dp),
            imageVector = Icons.Filled.Close,
            contentDescription = "Close",
            tint = color
        )
        else -> {}
    }
}