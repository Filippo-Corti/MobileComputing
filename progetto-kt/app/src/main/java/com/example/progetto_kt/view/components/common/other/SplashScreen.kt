package com.example.progetto_kt.view.components.common.other

import android.window.SplashScreen
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.unit.dp
import com.example.progetto_kt.R
import com.example.progetto_kt.view.styles.Colors

@Composable
fun SplashScreen(
) {
    Column(
       modifier = Modifier
           .fillMaxSize()
           .background(color = Colors.PRIMARY),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {

        Image(
            painter = painterResource(R.drawable.logo_green),
            contentDescription = "MangiaEBasta",
            modifier = Modifier
                .size(120.dp),
            contentScale = ContentScale.Fit
        )

    }
}