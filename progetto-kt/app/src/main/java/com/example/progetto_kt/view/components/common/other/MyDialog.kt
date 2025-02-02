package com.example.progetto_kt.view.components.common.other

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Card
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.compose.ui.window.Dialog
import com.example.progetto_kt.view.components.common.icons.IconNames
import com.example.progetto_kt.view.components.common.icons.MyIcon
import com.example.progetto_kt.view.styles.Colors
import com.example.progetto_kt.view.styles.Global

@Composable
fun MyDialog(
    title: String,
    content: String,
    onDismissRequest: () -> Unit
) {
    Dialog(
        onDismissRequest = { onDismissRequest() }
    ) {
        Card(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            shape = RoundedCornerShape(16.dp),
        ) {

            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(16.dp)
            ) {

                Box(
                    modifier = Modifier
                        .clickable { onDismissRequest() }
                        .align(Alignment.TopEnd),
                ) {
                    MyIcon(
                        name = IconNames.CROSS,
                        color = Colors.BLACK,
                        size = 24
                    )
                }

                Column (
                    modifier = Modifier
                        .fillMaxWidth()
                        .align(Alignment.Center)
                        .padding(top = 5.dp),
                    verticalArrangement = Arrangement.Center,
                    horizontalAlignment = Alignment.CenterHorizontally
                ){

                    Text(
                        text = title,
                        color = Colors.BLACK,
                        fontSize = Global.FontSizes.Title,
                        fontFamily = Global.Fonts.Bold,
                        modifier = Modifier.padding(vertical = 3.dp)
                    )

                    Text(
                        text = content,
                        color = Colors.BLACK,
                        fontSize = Global.FontSizes.Normal,
                        fontFamily = Global.Fonts.Regular,
                        modifier = Modifier.padding(vertical = 8.dp)
                    )

                }

            }
        }
    }
}