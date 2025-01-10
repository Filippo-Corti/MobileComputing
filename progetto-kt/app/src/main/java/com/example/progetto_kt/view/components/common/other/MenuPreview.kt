package com.example.progetto_kt.view.components.common.other

import android.graphics.BitmapFactory
import androidx.compose.foundation.Image
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CutCornerShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.asImageBitmap
import androidx.compose.ui.unit.dp
import com.example.progetto_kt.model.dataclasses.MenuDetailsWithImage
import com.example.progetto_kt.model.dataclasses.MenuWithImage
import com.example.progetto_kt.view.components.common.icons.IconNames
import com.example.progetto_kt.view.components.common.icons.MyIcon
import com.example.progetto_kt.view.styles.Colors
import com.example.progetto_kt.view.styles.Global
import com.example.progetto_kt.viewmodel.MainViewModel
import kotlin.io.encoding.Base64
import kotlin.io.encoding.ExperimentalEncodingApi

@Composable
fun MenuPreview(
    viewModel: MainViewModel,
    menu : MenuWithImage,
    onPress : () -> Unit
) {
    val distance = viewModel.distanceFromUserLocation(menu.menu.location)

    MenuPreviewBody(
        title = menu.menu.name,
        description = menu.menu.shortDescription,
        price = menu.menu.price,
        distance = if (distance >= 0F) distance else null,
        deliveryTime = menu.menu.deliveryTime,
        image = menu.image?.raw,
        onPress = onPress
    )
}

@Composable
fun MenuPreview(
    viewModel: MainViewModel,
    menu : MenuDetailsWithImage,
    onPress : () -> Unit
) {
    val distance = viewModel.distanceFromUserLocation(menu.menuDetails.location)

    MenuPreviewBody(
        title = menu.menuDetails.name,
        description = menu.menuDetails.shortDescription,
        price = menu.menuDetails.price,
        distance = if (distance >= 0F) distance else null,
        deliveryTime = menu.menuDetails.deliveryTime,
        image = menu.image.raw,
        onPress = onPress
    )
}

@OptIn(ExperimentalEncodingApi::class)
@Composable
fun MenuPreviewBody(
    title : String,
    description : String,
    price : Float,
    distance : Float?,
    deliveryTime : Int,
    image : String?,
    onPress : () -> Unit
) {
    val priceStr = "%.2f".format(price)
    val deliveryTimeStr = if (deliveryTime > 0) deliveryTime.toString() else "<1"


    Row(
        modifier =  Modifier
            .fillMaxWidth()
            .padding(horizontal = 8.dp, vertical = 15.dp)
            .border(
                width = 1.dp,
                color = Colors.LIGHT_GRAY,
                shape = CutCornerShape(topStart = 0.dp, topEnd = 0.dp, bottomEnd = 0.dp, bottomStart = 0.dp)
            )
            .clickable { onPress() },
        horizontalArrangement = Arrangement.spacedBy(15.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth(0.6F),
            verticalArrangement = Arrangement.SpaceBetween
        ) {
            Column {

                Text(
                    text = title,
                    color = Colors.BLACK,
                    fontFamily = Global.Fonts.Medium,
                    fontSize = Global.FontSizes.Normal
                )

                Text(
                    text = "€$priceStr",
                    color = Colors.BLACK,
                    fontFamily = Global.Fonts.Regular,
                    fontSize = Global.FontSizes.Small,
                    modifier = Modifier
                        .padding(bottom = 4.dp)
                )

                Text(
                    text = description,
                    color = Colors.DARK_GRAY,
                    fontFamily = Global.Fonts.Regular,
                    fontSize = Global.FontSizes.Small,
                    modifier = Modifier
                        .padding(bottom = 3.dp)
                )

            }

            Column {
                if (distance != null) {
                    Text(
                        text = "${deliveryTimeStr}min • ${distance}km from you",
                        color = Colors.BLACK,
                        fontFamily = Global.Fonts.Regular,
                        fontSize = Global.FontSizes.Small
                    )
                }
            }
        }

        Column(
            modifier = Modifier
                .fillMaxSize(),
            verticalArrangement = Arrangement.Center,
            horizontalAlignment = Alignment.CenterHorizontally
        ) {

            if (image != null) {
                val byteArray = Base64.decode(image)
                val bitmap =
                    BitmapFactory.decodeByteArray(byteArray, 0, byteArray.size)

                Image(
                    bitmap = bitmap.asImageBitmap(),
                    contentDescription = title,
                    modifier = Modifier.size(120.dp, 120.dp)
                )
            } else {
                
                MyIcon(
                    name = IconNames.FOOD,
                    size = 100,
                    color = Colors.GRAY
                )

            }
        }
    }

}