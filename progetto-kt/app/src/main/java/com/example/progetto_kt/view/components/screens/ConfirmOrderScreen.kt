package com.example.progetto_kt.view.components.screens

import android.util.Log
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.layout.wrapContentHeight
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Button
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.asImageBitmap
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.progetto_kt.model.repositories.MenuRepository
import com.example.progetto_kt.view.components.common.buttons.LargeButton
import com.example.progetto_kt.view.components.common.icons.IconNames
import com.example.progetto_kt.view.components.common.icons.MyIcon
import com.example.progetto_kt.view.components.common.other.InfoTextBox
import com.example.progetto_kt.view.components.common.other.MenuSmallPreview
import com.example.progetto_kt.view.components.common.other.Separator
import com.example.progetto_kt.view.styles.Colors
import com.example.progetto_kt.view.styles.Global
import com.example.progetto_kt.viewmodel.MainViewModel

@Composable
fun ConfirmOrderScreen(
    viewModel: MainViewModel,
    menuId: Int,
    onOrderClick: () -> Unit,
    onBackClick: () -> Unit
) {

    val TAG = "ConfirmOrderScreen"

    val appState by viewModel.appState.collectAsState()
    val userState by viewModel.userState.collectAsState()
    val locationState by viewModel.locationState.collectAsState()
    val menusState by viewModel.menusExplorationState.collectAsState()

    val menu = menusState.selectedMenu

    LaunchedEffect(menuId) {
        if (menu == null)
            viewModel.fetchMenuDetails(menuId)
    }

    if (appState.isLoading || menu == null) {
        return Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
            CircularProgressIndicator(color = Colors.PRIMARY)
        }
    }

    val menuDetails = menu.menuDetails

    val price = "%.2f".format(menuDetails.price)
    val deliveryTime = if (menuDetails.deliveryTime > 0) menuDetails.deliveryTime else "<1"
    val cardLast4 = userState.user?.cardNumber?.takeLast(4)

    Box(
        modifier = Global.Container
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
    ) {
        Column(
            modifier = Modifier
                .fillMaxHeight()
        ) {

            Box(
                modifier = Modifier
                    .fillMaxWidth(),
                contentAlignment = Alignment.Center
            ) {

                Text(
                    text = "Your Order",
                    color = Colors.BLACK,
                    fontSize = Global.FontSizes.Title,
                    fontFamily = Global.Fonts.Regular,
                    modifier = Modifier.padding(vertical = 3.dp)
                )

                Row(
                    modifier = Modifier
                        .size(60.dp)
                        .align(Alignment.CenterStart)
                        .clickable { onBackClick() },
                    horizontalArrangement = Arrangement.Center,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Box(
                        modifier = Modifier
                            .background(Colors.WHITE, shape = CircleShape)
                            .padding(5.dp)
                    ) {
                        MyIcon(
                            name = IconNames.ARROW_LEFT,
                            size = 32,
                            color = Colors.BLACK
                        )
                    }
                }
            }

            if (locationState.lastKnownLocation != null && locationState.lastKnownLocation?.address != null) {

                if (menuDetails.location.address != null) {
                    InfoTextBox(
                        iconName = IconNames.MARKER,
                        label = "Menu Location",
                        text = menuDetails.location.address!!
                    )

                    Separator(color = Colors.LIGHT_GRAY, size = 1)
                }

                InfoTextBox(
                    iconName = IconNames.HOME,
                    label = "Your Location",
                    text = locationState.lastKnownLocation!!.address!!
                )

                Separator(color = Colors.LIGHT_GRAY, size = 10)

                Row(
                    modifier = Global.InsetContainer
                        .padding(vertical = 20.dp),
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Text(
                        text = "Delivery Time",
                        color = Colors.BLACK,
                        fontSize = Global.FontSizes.Normal,
                        fontFamily = Global.Fonts.Medium,
                    )

                    Text(
                        text = "$deliveryTime min(s)",
                        color = Colors.BLACK,
                        fontSize = Global.FontSizes.Normal,
                        fontFamily = Global.Fonts.Medium,
                    )
                }

                Separator(color = Colors.LIGHT_GRAY, size = 10)

            }

            MenuSmallPreview(
                title = menuDetails.name,
                price = price,
                image = menu.image.raw
            )

            Separator(color = Colors.LIGHT_GRAY, size = 1)

            Row(
                modifier = Global.InsetContainer
                    .padding(vertical = 20.dp),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Text(
                    text = "Total",
                    color = Colors.BLACK,
                    fontSize = Global.FontSizes.Normal,
                    fontFamily = Global.Fonts.Medium,
                )

                Text(
                    text = "€$price",
                    color = Colors.BLACK,
                    fontSize = Global.FontSizes.Normal,
                    fontFamily = Global.Fonts.Medium,
                )
            }

            Separator(color = Colors.LIGHT_GRAY, size = 1)

            if (userState.user != null) {
                Row(
                    modifier = Global.InsetContainer
                        .padding(top = 20.dp)
                ) {
                    Text(
                        text = "Payment Method",
                        color = Colors.BLACK,
                        fontSize = Global.FontSizes.Normal,
                        fontFamily = Global.Fonts.Medium,
                    )

                }

                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(vertical = 20.dp, horizontal = 30.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {

                    MyIcon(name = IconNames.CREDIT_CARD, size = 42, color = Colors.GRAY)
                    Spacer(modifier = Modifier.width(20.dp))

                    Column(modifier = Modifier.weight(1f)) {

                        Text(
                            text = "${userState.user!!.cardFullName}'s Credit Card \n" +
                                    "**** **** **** $cardLast4",
                            color = Colors.DARK_GRAY,
                            fontFamily = Global.Fonts.Regular,
                            fontSize = Global.FontSizes.Normal
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.weight(1f))

            // Order Button
            Column(
                modifier = Modifier.padding(16.dp)
            ) {
                Text(
                    text = "If you’re not around when the drone arrives, they’ll leave " +
                            "your order at the door. By placing your order, you agree " +
                            "to take full responsibility for it once it’s delivered.",
                    color = Colors.BLACK,
                    fontSize = Global.FontSizes.Small,
                    fontFamily = Global.Fonts.Regular,
                    modifier = Modifier.padding(vertical = 15.dp)
                )

                LargeButton(
                    text = "Confirm and Pay",
                    onPress = { onOrderClick() }
                )
            }
        }
    }
}
