package com.example.progetto_kt.view.components.common.other

import android.util.Log
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.example.progetto_kt.view.styles.Colors

@Composable
fun ProgressBar(
    progress : Int
) {

    var remainingProgress = progress
    val splitProgress = mutableListOf<Int>()
    for (i in 0..4) {
        splitProgress.add(if (remainingProgress >= 20) 100 else remainingProgress*100/20)
        remainingProgress = (remainingProgress - 20).coerceAtLeast(0);
    }

    Row (
        modifier = Modifier
            .fillMaxWidth()
            .height(5.dp)
    ) {

        splitProgress.forEach {

            Box(
                modifier = Modifier
                    .fillMaxHeight()
                    .padding(horizontal = 2.5.dp)
                    .weight(1f)
                    .background(Colors.GRAY)
            ) {
                Box(
                    modifier = Modifier
                        .fillMaxHeight()
                        .fillMaxWidth(it/100F)
                        .background(Colors.PRIMARY)
                ) {}
            }

        }
    }


}