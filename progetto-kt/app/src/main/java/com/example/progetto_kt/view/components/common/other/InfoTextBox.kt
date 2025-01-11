package com.example.progetto_kt.view.components.common.other

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.layout.wrapContentHeight
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.example.progetto_kt.view.components.common.icons.IconNames
import com.example.progetto_kt.view.components.common.icons.MyIcon
import com.example.progetto_kt.view.styles.Colors
import com.example.progetto_kt.view.styles.Global

@Composable
fun InfoTextBox(
    text : String,
    label : String? = null,
    iconName : IconNames? = null
) {

    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 18.dp, horizontal = 30.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {

        if (iconName != null) {
            MyIcon(name = iconName, size = 35, color = Colors.BLACK)
            Spacer(modifier = Modifier.width(20.dp))
        }

        Column(modifier = Modifier.weight(1f)) {

            if (label != null) {
                Text(
                    text = label,
                    color = Colors.DARK_GRAY,
                    fontFamily = Global.Fonts.Regular,
                    fontSize = Global.FontSizes.Small
                )
            }
            Text(
                text = text,
                color = Colors.BLACK,
                fontFamily = Global.Fonts.Medium,
                fontSize = Global.FontSizes.Normal,
                modifier = Modifier
                    .fillMaxWidth()
                    .wrapContentHeight()
            )
        }
    }

}