package com.example.progetto_kt.view.components.screens

import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import com.example.progetto_kt.R
import com.example.progetto_kt.model.dataclasses.MenuDetailsWithImage
import com.example.progetto_kt.model.dataclasses.Order
import com.example.progetto_kt.model.dataclasses.OrderStatus
import com.example.progetto_kt.model.dataclasses.User
import com.example.progetto_kt.view.components.common.buttons.ButtonWithArrow
import com.example.progetto_kt.view.components.common.buttons.MinimalistButton
import com.example.progetto_kt.view.components.common.other.CardInformation
import com.example.progetto_kt.view.components.common.other.CreditCard
import com.example.progetto_kt.view.components.common.other.MenuPreview
import com.example.progetto_kt.view.components.common.other.Separator
import com.example.progetto_kt.view.styles.Colors
import com.example.progetto_kt.view.styles.Global
import com.example.progetto_kt.viewmodel.MainViewModel
import com.mapbox.maps.extension.style.expressions.dsl.generated.min

@Composable
fun AccountScreen(
    viewModel: MainViewModel,
    onEditAccountClick: (Boolean) -> Unit,
    onOrderAgainClick: (Int) -> Unit,
    onCheckLastOrderClick: () -> Unit,
) {

    val appState by viewModel.appState.collectAsState()
    val userState by viewModel.userState.collectAsState()
    val orderState by viewModel.lastOrderState.collectAsState()

    LaunchedEffect(Unit) {
        viewModel.fetchLastOrderDetails()
    }

    if (appState.isLoading) {
        return Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
            CircularProgressIndicator(color = Colors.PRIMARY)
        }
    }

    val user = userState.user
    val lastOrder = orderState.lastOrder
    val lastOrderMenu = orderState.lastOrderMenu

    if (user == null) {
        return Column {
            NotLoggedHeader { onEditAccountClick(true) }
            Separator(size = 1, color = Colors.LIGHT_GRAY)
        }
    }

    Column(
        modifier = Global.Container
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
            .padding(top = 25.dp)
    ) {

        LoggedHeader(user) { onEditAccountClick(false) }
        Separator(size = 1, color = Colors.LIGHT_GRAY)

        if (lastOrder != null && lastOrderMenu != null) {
            LastOrder(
                viewModel = viewModel,
                menu = lastOrderMenu,
                order = lastOrder,
            ) {
                if (lastOrder.status == OrderStatus.ON_DELIVERY) {
                    onCheckLastOrderClick()
                } else {
                    onOrderAgainClick(lastOrderMenu.menuDetails.id)
                }
            }

        }

        CreditCardBox(user = user)

    }

}

@Composable
fun NotLoggedHeader(
    onNewAccountClick: () -> Unit
) {
    Column(
        modifier = Modifier
            .padding(bottom = 15.dp)
            .fillMaxWidth(),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {

        Box(
            modifier = Modifier
                .background(Colors.WHITE, shape = CircleShape)
                .padding(bottom = 10.dp)
        ) {
            Image(
                painter = painterResource(R.drawable.default_avatar),
                contentDescription = "User Icon",
                modifier = Modifier
                    .size(100.dp)
                    .clip(CircleShape),
                contentScale = ContentScale.Crop
            )
        }

        MinimalistButton(
            text = "NEW ACCOUNT",
            onPress = onNewAccountClick
        )
    }
}

@Composable
fun LoggedHeader(
    user: User,
    onEditAccountClick: () -> Unit
) {
    Column(
        modifier = Modifier
            .padding(bottom = 15.dp)
            .fillMaxWidth(),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {

        Box(
            modifier = Modifier
                .background(Colors.WHITE, shape = CircleShape)
                .padding(bottom = 12.dp)
        ) {
            Image(
                painter = painterResource(R.drawable.default_avatar),
                contentDescription = "User Icon",
                modifier = Modifier
                    .size(100.dp)
                    .clip(CircleShape),
                contentScale = ContentScale.Crop
            )
        }

        Text(
            text = "${user.firstName} ${user.lastName}",
            color = Colors.BLACK,
            fontSize = Global.FontSizes.Normal,
            fontFamily = Global.Fonts.Regular,
            modifier = Modifier.padding(bottom = 4.dp),
            textAlign = TextAlign.Center
        )

        MinimalistButton(
            text = "EDIT ACCOUNT",
            onPress = onEditAccountClick
        )
    }
}

@Composable
fun LastOrder(
    viewModel: MainViewModel,
    menu: MenuDetailsWithImage,
    order: Order,
    onPress: () -> Unit
) {
    Column(
        modifier = Global.InsetContainer
            .padding(top = 20.dp)
    ) {

        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(bottom = 4.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {

            Text(
                text = "Your last order",
                color = Colors.BLACK,
                fontSize = Global.FontSizes.Subtitle,
                fontFamily = Global.Fonts.Regular,
            )

            ButtonWithArrow(
                text = if (order.status == OrderStatus.ON_DELIVERY) "Check Last Order" else "Order Again",
                onPress = onPress
            )

        }

    }

    MenuPreview(
        viewModel = viewModel,
        menu = menu,
        onPress = {}
    )

}

@Composable
fun CreditCardBox(
    user: User
) {
    Box(
        modifier = Global.InsetContainer
            .padding(top = 20.dp, bottom = 40.dp)
            .fillMaxWidth(0.95F),
        contentAlignment = Alignment.Center
    ) {

        CreditCard(
            cardInformation = CardInformation(
                holder = user.cardFullName,
                number = user.cardNumber,
                expiryYear = user.cardExpireYear,
                expiryMonth = user.cardExpireMonth
            )
        )

    }
}