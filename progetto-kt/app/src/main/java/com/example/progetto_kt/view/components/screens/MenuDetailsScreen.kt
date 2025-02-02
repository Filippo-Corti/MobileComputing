package com.example.progetto_kt.view.components.screens

import android.graphics.BitmapFactory
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
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Button
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Divider
import androidx.compose.material3.IconButton
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.RectangleShape
import androidx.compose.ui.graphics.asImageBitmap
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.progetto_kt.view.components.common.buttons.LargeButton
import com.example.progetto_kt.view.components.common.icons.IconNames
import com.example.progetto_kt.view.components.common.icons.MyIcon
import com.example.progetto_kt.view.components.common.other.InfoTextBox
import com.example.progetto_kt.view.components.common.other.MyDialog
import com.example.progetto_kt.view.components.common.other.Separator
import com.example.progetto_kt.view.styles.Colors
import com.example.progetto_kt.view.styles.Global
import com.example.progetto_kt.viewmodel.MainViewModel
import kotlin.io.encoding.Base64
import kotlin.io.encoding.ExperimentalEncodingApi

@OptIn(ExperimentalEncodingApi::class)
@Composable
fun MenuDetailsScreen(
    viewModel: MainViewModel,
    menuId: Int,
    onCheckIngredientsClick: (Int) -> Unit,
    onForwardClick: (Int) -> Unit,
    onBackClick: () -> Unit
) {

    val appState by viewModel.appState.collectAsState()
    val menusState by viewModel.menusExplorationState.collectAsState()
    val locationState by viewModel.locationState.collectAsState()
    var showDialog by remember { mutableStateOf(false) }

    LaunchedEffect(menuId) {
        viewModel.fetchMenuDetails(menuId)
    }

    val menu = menusState.selectedMenu

    if (appState.isLoading || menu == null || menu.menuDetails.id != menuId) {
        return Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
            CircularProgressIndicator(color = Colors.PRIMARY)
        }
    }

    val menuDetails = menu.menuDetails
    val byteArray = Base64.decode(menu.image.raw)
    val bitmap = BitmapFactory.decodeByteArray(byteArray, 0, byteArray.size)
    val price = "%.2f".format(menuDetails.price)
    val deliveryTime = if (menuDetails.deliveryTime > 0) "${menuDetails.deliveryTime}" else "<1"

    Column(
        modifier = Global.Container
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
    ) {

        Box(
            modifier = Modifier
                .fillMaxWidth()
                .height(250.dp),
            contentAlignment = Alignment.Center
        ) {
            if (menu.image.raw.isNotEmpty()) {
                Image(
                    bitmap = bitmap.asImageBitmap(),
                    contentDescription = "Menu Image",
                    modifier = Modifier.fillMaxSize(),
                    contentScale = ContentScale.Crop
                )
            } else {
                MyIcon(
                    name = IconNames.FOOD,
                    size = 100,
                    color = Colors.GRAY
                )
            }


            Row(
                modifier = Modifier
                    .size(60.dp)
                    .align(Alignment.TopStart)
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

        Column(
            modifier = Global.InsetContainer
                .padding(vertical = 20.dp)
        ) {
            Text(
                text = menuDetails.name,
                color = Colors.BLACK,
                fontSize = Global.FontSizes.Title,
                fontFamily = Global.Fonts.Bold,
                modifier = Modifier.padding(vertical = 8.dp)
            )

            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(8.dp),
                modifier = Modifier.padding(vertical = 4.dp)
            ) {
                MyIcon(name = IconNames.PRICE_TAG, size = 22, color = Colors.PRIMARY)
                Text(
                    text = "€$price",
                    color = Colors.DARK_GRAY,
                    fontSize = Global.FontSizes.Subtitle,
                    fontFamily = Global.Fonts.Medium,
                )
            }

            Text(
                text = menuDetails.longDescription,
                color = Colors.BLACK,
                fontSize = Global.FontSizes.Normal,
                fontFamily = Global.Fonts.Regular,
                modifier = Modifier.padding(vertical = 10.dp)
            )
        }

        Separator(color = Colors.LIGHT_GRAY, size = 10)


        if (locationState.lastKnownLocation != null) {

            if (menuDetails.location.address != null) {
                InfoTextBox(
                    iconName = IconNames.MARKER,
                    label = "Menu Location",
                    text = menuDetails.location.address!!
                )

                Separator(color = Colors.LIGHT_GRAY, size = 10)
            }

            InfoTextBox(
                iconName = IconNames.CLOCK,
                text = "Approximately $deliveryTime min(s)"
            )

            Separator(color = Colors.LIGHT_GRAY, size = 1)
        }

        Spacer(modifier = Modifier.weight(1f))

        // Ingredients Button
        Box(
            modifier = Modifier.padding(top = 16.dp, start = 16.dp, end = 16.dp)
        ) {
            LargeButton(
                text = "Check ingredients",
                gray = true,
                onPress = { onCheckIngredientsClick(menuId) }
            )
        }

        // Order Button
        Box(
            modifier = Modifier.padding(16.dp)
        ) {
            LargeButton(
                text = "Order • €$price",
                onPress = { onForwardClick(menuId) }
            )
        }
    }

}
