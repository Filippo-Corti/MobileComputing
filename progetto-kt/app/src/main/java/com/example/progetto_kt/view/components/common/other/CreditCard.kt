package com.example.progetto_kt.view.components.common.other

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.progetto_kt.view.components.common.icons.IconNames
import com.example.progetto_kt.view.components.common.icons.MyIcon

data class CardInformation(
    val number : String,
    val holder : String,
    val expiryMonth : Int,
    val expiryYear: Int
)

@Composable
fun CreditCard(
    cardInformation: CardInformation
) {

    val last4Digits = cardInformation.number.takeLast(4)
    val formattedDate = "${cardInformation.expiryMonth.toString().padStart(2, '0')}/${cardInformation.expiryYear.toString().padStart(2, '0')}"

    Box(
        modifier = Modifier
            .padding(16.dp)
            .fillMaxWidth()
            .background(
                brush = Brush.linearGradient(
                    colors = listOf(Color(0xFFB935D5), Color(0xFF6467B4), Color(0xFF4CACE0)),

                ),
                shape = RoundedCornerShape(25.dp)
            )
            .height(210.dp)
    ) {
        Column(
            modifier = Modifier
                .align(Alignment.Center)
                .padding(26.dp)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                MyIcon(name = IconNames.CC_CHIP, size = 40, color = Color(0xFFF0C761))
                MyIcon(name = IconNames.VISA, size = 38, color = Color.White)
            }

            Spacer(modifier = Modifier.height(20.dp))

            Text(
                text = "**** **** **** $last4Digits",
                color = Color.White,
                fontSize = 24.sp,
                modifier = Modifier.align(Alignment.Start),
                letterSpacing = 3.sp
            )

            Spacer(modifier = Modifier.height(20.dp))

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Column {
                    Text(text = "Card Holder name", color = Color.White, fontSize = 12.sp)
                    Text(text = cardInformation.holder, color = Color.White, fontSize = 16.sp)
                }
                Column {
                    Text(text = "Expiry Date", color = Color.White, fontSize = 12.sp)
                    Text(text = formattedDate, color = Color.White, fontSize = 16.sp)
                }
            }
        }
    }

}