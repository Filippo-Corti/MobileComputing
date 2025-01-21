package com.example.progetto_kt.view.components.screens

import android.util.Log
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.input.KeyboardCapitalization
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.lifecycle.viewmodel.initializer
import androidx.lifecycle.viewmodel.viewModelFactory
import com.example.progetto_kt.view.components.common.buttons.LargeButton
import com.example.progetto_kt.view.components.common.forms.FormField
import com.example.progetto_kt.view.components.common.forms.SelectNumber
import com.example.progetto_kt.view.components.common.icons.IconNames
import com.example.progetto_kt.view.components.common.icons.MyIcon
import com.example.progetto_kt.view.components.common.other.Separator
import com.example.progetto_kt.view.styles.Colors
import com.example.progetto_kt.view.styles.Global
import com.example.progetto_kt.viewmodel.AccountFormViewModel
import com.example.progetto_kt.viewmodel.MainViewModel
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

@Composable
fun AddEditAccountScreen(
    viewModel: MainViewModel,
    newAccount: Boolean = false,
    onBackClick: () -> Unit
) {

    val viewModelFactory = viewModelFactory {
        initializer {
            AccountFormViewModel(
                viewModel.getUserRepository(),
                viewModel.userState.value.user
            )
        }
    }

    val formViewModel: AccountFormViewModel = viewModel(
        factory = viewModelFactory
    )

    val appState by viewModel.appState.collectAsState()
    val formParams by formViewModel.formParams.collectAsState()
    var submitFailed by remember { mutableStateOf(false) }

    if (appState.isLoading) {
        return Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
            CircularProgressIndicator(color = Colors.PRIMARY)
        }
    }


    Column(
        modifier = Global.Container
            .fillMaxHeight()
    ) {

        Box(
            modifier = Modifier
                .fillMaxWidth(),
            contentAlignment = Alignment.Center
        ) {

            Text(
                text = "Your Account",
                color = Colors.BLACK,
                fontSize = Global.FontSizes.Title,
                fontFamily = Global.Fonts.Regular,
                modifier = Modifier.padding(vertical = 3.dp)
            )

            Row(
                modifier = Modifier
                    .size(60.dp)
                    .align(Alignment.CenterStart)
                    .clickable { onBackClick() },
                horizontalArrangement = Arrangement.Center,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Box(
                    modifier = Modifier
                        .background(Colors.WHITE, shape = CircleShape)
                        .padding(5.dp)
                ) {
                    MyIcon(
                        name = IconNames.ARROW_LEFT,
                        size = 32,
                        color = Colors.BLACK
                    )
                }
            }
        }


        Column(
            modifier = Global.InsetContainer
                .padding(top = 15.dp, bottom = 15.dp, start = 5.dp)
        ) {

            Text(
                text = "General Information",
                color = Colors.BLACK,
                fontSize = Global.FontSizes.Subtitle,
                fontFamily = Global.Fonts.Medium,
                modifier = Modifier.padding(top = 3.dp, bottom = 20.dp)
            )

            FormField(
                label = "First Name",
                value = formParams.firstName,
                onValueChange = { formViewModel.onFirstNameChange(it) },
                errorMessage = "First Name should be at most 15 characters and not empty",
                showError = submitFailed,
                keyBoardOptions = KeyboardOptions(
                    keyboardType = KeyboardType.Text,
                    capitalization = KeyboardCapitalization.Sentences
                )
            )

            FormField(
                label = "Last Name",
                value = formParams.lastName,
                onValueChange = { formViewModel.onLastNameChange(it) },
                errorMessage = "Last Name should be at most 15 characters and not empty",
                showError = submitFailed,
                keyBoardOptions = KeyboardOptions(
                    keyboardType = KeyboardType.Text,
                    capitalization = KeyboardCapitalization.Sentences
                )
            )

        }

        Separator(size = 10, color = Colors.LIGHT_GRAY)

        Column(
            modifier = Global.InsetContainer
                .padding(top = 20.dp, bottom = 15.dp, start = 5.dp)
        ) {

            Text(
                text = "Payment Method • Credit Card",
                color = Colors.BLACK,
                fontSize = Global.FontSizes.Subtitle,
                fontFamily = Global.Fonts.Medium,
                modifier = Modifier.padding(top = 3.dp, bottom = 20.dp)
            )

            FormField(
                label = "Holder Name",
                value = formParams.cardFullName,
                onValueChange = { formViewModel.onCardFullNameChange(it) },
                errorMessage = "Credit Card Name should be at most 31 characters and not empty",
                showError = submitFailed,
                keyBoardOptions = KeyboardOptions(
                    keyboardType = KeyboardType.Text,
                    capitalization = KeyboardCapitalization.Words
                )
            )

            FormField(
                label = "Number",
                value = formParams.cardNumber,
                onValueChange = { formViewModel.onCardNumberChange(it) },
                errorMessage = "Card Number should be 16 digits",
                showError = submitFailed,
                keyBoardOptions = KeyboardOptions(
                    keyboardType = KeyboardType.Number
                )
            )

            Text(
                text = "Expiry Date",
                color = Colors.DARK_GRAY,
                fontFamily = Global.Fonts.Regular,
                fontSize = Global.FontSizes.Small,
                modifier = Modifier.padding(top = 20.dp)
            )

            Row(
                modifier = Modifier
                    .fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {

                SelectNumber(
                    min = 1,
                    max = 12,
                    value = formParams.cardExpireMonth.toString(),
                    onValueChange = { formViewModel.onCardExpireMonthChange(it.toInt()) },
                )

                Text(
                    text = "/",
                    color = Colors.BLACK,
                    fontSize = Global.FontSizes.Subtitle,
                    fontFamily = Global.Fonts.Medium
                )

                SelectNumber(
                    min = 2025,
                    max = 2034,
                    value = formParams.cardExpireYear.toString(),
                    onValueChange = { formViewModel.onCardExpireYearChange(it.toInt()) },
                )

            }

            FormField(
                label = "CVV",
                value = formParams.cardCVV,
                onValueChange = { formViewModel.onCardCVVChange(it) },
                errorMessage = "Card CVV should be 3 digits",
                showError = submitFailed,
                keyBoardOptions = KeyboardOptions(
                    keyboardType = KeyboardType.Number
                )
            )

        }

        Spacer(modifier = Modifier.weight(1f))

        // Order Button
        Box(
            modifier = Modifier.padding(16.dp)
        ) {

            LargeButton(
                text = if (newAccount) "Create Account" else "Save",
                onPress = {
                    CoroutineScope(Dispatchers.Main).launch {
                        val ok = formViewModel.submit(viewModel::updateUserData)
                        Log.d("AddEditAccountScreen", "Submit result is $ok")
                        if (ok)
                            onBackClick()
                        else
                            submitFailed = true
                    }
                }
            )
        }
    }
}
