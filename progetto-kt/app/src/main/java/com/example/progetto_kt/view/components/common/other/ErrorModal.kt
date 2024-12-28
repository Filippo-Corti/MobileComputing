package com.example.progetto_kt.view.components.common.other

import android.app.Activity
import android.content.Context
import android.util.Log
import androidx.compose.foundation.layout.Column
import androidx.compose.material3.Button
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.ModalBottomSheet
import androidx.compose.material3.Text
import androidx.compose.material3.rememberModalBottomSheetState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.rememberCoroutineScope
import androidx.navigation.NavController
import com.example.progetto_kt.model.dataclasses.Error
import com.example.progetto_kt.model.dataclasses.ErrorType
import com.example.progetto_kt.view.navigation.AppScreen
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
fun ErrorModal(
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
            Text(
                text = "Title: ${error.title}",
            )

            Text(
                text = "Message: ${error.message}",
            )

            if (error.actionText != null) {
                Button(
                    onClick = {
                        scope.launch { sheetState.hide() }.invokeOnCompletion {
                            onAction()
                        }
                    }
                ) {
                    Text(
                        text = error.actionText,
                    )
                }
            }

            Button(
                onClick = {
                    scope.launch { sheetState.hide() }.invokeOnCompletion {
                        onDismiss()
                    }
                }
            ) {
                Text(
                    text = error.dismissText,
                )
            }
        }
    }
}
