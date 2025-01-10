package com.example.progetto_kt.view.components.common.other

import android.graphics.BitmapFactory
import androidx.compose.foundation.Image
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.asImageBitmap
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.unit.dp
import com.example.progetto_kt.model.dataclasses.MenuDetails
import com.example.progetto_kt.model.dataclasses.MenuDetailsWithImage
import com.example.progetto_kt.view.components.common.icons.IconNames
import com.example.progetto_kt.view.components.common.icons.MyIcon
import com.example.progetto_kt.view.styles.Colors
import com.example.progetto_kt.view.styles.Global
import kotlin.io.encoding.Base64
import kotlin.io.encoding.ExperimentalEncodingApi

@OptIn(ExperimentalEncodingApi::class)
@Composable
fun MenuSmallPreview(
    title : String,
    price : String,
    image : String?
) {

    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 30.dp, vertical = 20.dp)
            .height(60.dp),
        horizontalArrangement = Arrangement.SpaceBetween
    ) {

        Column(
            modifier = Modifier
                .height(60.dp),
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
                    modifier = Modifier.size(60.dp, 60.dp),
                    contentScale = ContentScale.Crop
                )
            } else {

                MyIcon(
                    name = IconNames.FOOD,
                    size = 50,
                    color = Colors.GRAY
                )

            }
        }

        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(horizontal = 20.dp),
            verticalArrangement = Arrangement.Center
        ) {

            Text(
                text = title,
                color = Colors.BLACK,
                fontFamily = Global.Fonts.Medium,
                fontSize = Global.FontSizes.Normal
            )

            Text(
                text = "€$price",
                color = Colors.DARK_GRAY,
                fontFamily = Global.Fonts.Regular,
                fontSize = Global.FontSizes.Normal
            )

        }

    }

}