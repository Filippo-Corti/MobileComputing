package com.example.progetto_kt.view.components.common.other

import android.app.Activity
import android.content.Context
import android.util.Log
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Button
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.ModalBottomSheet
import androidx.compose.material3.Text
import androidx.compose.material3.rememberModalBottomSheetState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.navigation.NavController
import com.example.progetto_kt.model.dataclasses.Error
import com.example.progetto_kt.model.dataclasses.ErrorType
import com.example.progetto_kt.view.components.common.buttons.LargeButton
import com.example.progetto_kt.view.components.navigation.AppScreen
import com.example.progetto_kt.view.styles.Colors
import com.example.progetto_kt.view.styles.Global
import kotlinx.coroutines.launch

val TAG = "ErrorModalHandler"

fun handleErrorByType(
    error : Error,
    context: Context,
    navController : NavController,
    onAskLocationPermission: () -> Unit
) {
    when (error.type) {
        ErrorType.NETWORK -> {
            // Reload the Activity
            Log.d(TAG, "Network Error")
            if (context is Activity) {
                context.finish()
                context.startActivity(context.intent)
            }
        }
        ErrorType.ACCOUNT_DETAILS -> {
            // Navigate to Account
            Log.d(TAG, "Account Error")
            navController.navigate(AppScreen.AccountStack.params.route)
        }
        ErrorType.POSITION_UNALLOWED -> {
            // Ask for Position
            Log.d(TAG, "Position Error")
            onAskLocationPermission()
        }
        else -> {}
    }
}


@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun BottomModal(
    error: Error,
    onAction : () -> Unit,
    onDismiss: () -> Unit
) {
    val sheetState = rememberModalBottomSheetState()
    val scope = rememberCoroutineScope()

    ModalBottomSheet(
        onDismissRequest = onDismiss,
        sheetState = sheetState
    ) {
        Column {

            Column {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(8.dp),
                ) {
                    Text(
                        text = error.title,
                        color = Colors.BLACK,
                        fontFamily = Global.Fonts.Bold,
                        fontSize = Global.FontSizes.Subtitle,
                        textAlign = TextAlign.Center,
                        modifier = Modifier
                            .fillMaxWidth()
                    )
                }

                HorizontalDivider(
                    thickness = 2.dp,
                    color = Colors.GRAY,
                )

                Text(
                    text = error.message,
                    color = Colors.BLACK,
                    fontFamily = Global.Fonts.Regular,
                    fontSize = Global.FontSizes.Normal,
                    modifier = Modifier
                        .padding(horizontal = 30.dp, vertical = 20.dp)
                )

            }

            Column(
                modifier = Modifier
                    .padding(horizontal = 16.dp, vertical = 10.dp)
            ) {

                if (error.actionText != null) {
                    Box(
                        modifier = Modifier
                            .padding(bottom = 8.dp)
                    ) {
                        LargeButton (
                            text = error.actionText,
                            onPress = {
                                scope.launch { sheetState.hide() }.invokeOnCompletion {
                                    onAction()
                                }
                            }
                        )
                    }
                }

                LargeButton(
                    text = error.dismissText,
                    gray = true,
                    onPress = {
                        scope.launch { sheetState.hide() }.invokeOnCompletion {
                            onDismiss()
                        }
                    }
                )


            }

        }
    }
}
