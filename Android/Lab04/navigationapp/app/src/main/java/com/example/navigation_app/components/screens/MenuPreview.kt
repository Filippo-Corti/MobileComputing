package com.example.navigation_app.components.screens

import androidx.compose.foundation.Image
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.navigation_app.R
import com.example.navigation_app.model.Menu

@Composable
fun MenuPreview(menu : Menu) {
    Row (
        modifier = Modifier
            .fillMaxWidth()
            .padding(16.dp),
    ) {
        Column (
            modifier = Modifier
                .weight(0.66f)
        ) {
            Text(
                text = menu.title,
                modifier = Modifier
                    .padding(0.dp, 0.dp, 0.dp, 8.dp),
                fontSize = 20.sp,
                fontWeight = FontWeight(700)
            )

            Text(
                text = menu.shortDescription
            )
        }

        Image(
            painter = painterResource(id = R.drawable.pizza),
            contentDescription = "Pizza Image",
            modifier = Modifier
                .size(80.dp)
                .weight(0.33f)
        )
    }
}