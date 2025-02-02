package com.example.progetto_kt.view.components.common.other

import android.graphics.BitmapFactory
import androidx.compose.foundation.Image
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.asImageBitmap
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.unit.dp
import com.example.progetto_kt.model.dataclasses.Ingredient
import com.example.progetto_kt.view.components.common.icons.IconNames
import com.example.progetto_kt.view.components.common.icons.MyIcon
import com.example.progetto_kt.view.styles.Colors
import com.example.progetto_kt.view.styles.Global
import kotlin.io.encoding.Base64

@Composable
fun IngredientItem(
    prefix : String,
    ingredient: Ingredient,
    onPress : () -> Unit
) {

    Box(
        modifier =  Modifier
            .fillMaxWidth()
            .padding(horizontal = 30.dp, vertical = 15.dp)
            .clickable { onPress() }
    ) {

        if (ingredient.bio) {
            Box(
                modifier = Modifier
                    .align(Alignment.TopEnd)
            ) {
                MyIcon(
                    name = IconNames.BIO,
                    color = Colors.PRIMARY,
                    size = 24
                )
            }
        }

        Column(
            modifier = Modifier
                .fillMaxWidth(0.6F)
                .fillMaxHeight(),
            verticalArrangement = Arrangement.SpaceBetween
        ) {

            Text(
                text = "$prefix ${ingredient.name}",
                color = Colors.BLACK,
                fontFamily = Global.Fonts.Medium,
                fontSize = Global.FontSizes.Normal
            )

            Text(
                text = ingredient.origin,
                color = Colors.DARK_GRAY,
                fontFamily = Global.Fonts.Regular,
                fontSize = Global.FontSizes.Small,
                modifier = Modifier
                    .padding(bottom = 3.dp)
            )

        }
    }

    HorizontalDivider(
        thickness = 1.dp,
        modifier = Modifier
            .padding(horizontal = 15.dp),
        color = Colors.LIGHT_GRAY
    )

}