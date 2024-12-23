package com.example.progetto_kt.view.components.screens

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material3.Button
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.lifecycle.viewmodel.initializer
import androidx.lifecycle.viewmodel.viewModelFactory
import com.example.progetto_kt.view.components.common.forms.FormField
import com.example.progetto_kt.view.components.common.forms.SelectNumber
import com.example.progetto_kt.viewmodel.AccountFormViewModel
import com.example.progetto_kt.viewmodel.MainViewModel
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

@Composable
fun AddEditAccountScreen(
    viewModel: MainViewModel,
    newAccount : Boolean = false,
    onBackClick : () -> Unit
) {

    val viewModelFactory = viewModelFactory {
        initializer {
            AccountFormViewModel(
                viewModel.userRepository,
                viewModel.uiState.value.user
            )
        }
    }

    val formViewModel: AccountFormViewModel = viewModel(
        factory = viewModelFactory
    )

    val formParams by formViewModel.formParams.collectAsState()

    Column (
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp)
    ) {
        Text(
            text = "New Account? $newAccount",
        )

        FormField(
            label = "First Name",
            value = formParams.firstName,
            onValueChange = { formViewModel.onFirstNameChange(it) },
            errorMessage = "First Name should be < 15 characters and not empty",
            keyBoardOptions = KeyboardOptions(
                keyboardType = KeyboardType.Text
            )
        )

        FormField(
            label = "Last Name",
            value = formParams.lastName,
            onValueChange = { formViewModel.onLastNameChange(it) },
            errorMessage = "Last Name should be < 15 characters and not empty",
            keyBoardOptions = KeyboardOptions(
                keyboardType = KeyboardType.Text
            )
        )


        FormField(
            label = "Card Full Name",
            value = formParams.cardFullName,
            onValueChange = { formViewModel.onCardFullNameChange(it) },
            errorMessage = "Last Name should be < 15 characters and not empty",
            keyBoardOptions = KeyboardOptions(
                keyboardType = KeyboardType.Text
            )
        )

        FormField(
            label = "Card Number",
            value = formParams.cardNumber,
            onValueChange = { formViewModel.onCardNumberChange(it) },
            errorMessage = "Card Number should be 16 digits",
            keyBoardOptions = KeyboardOptions(
                keyboardType = KeyboardType.Number
            )
        )

        SelectNumber(
            min = 1,
            max = 12,
            value = formParams.cardExpireMonth.toString(),
            label = "Card Expire Month",
            onValueChange = { formViewModel.onCardExpireMonthChange(it.toInt()) },
        )

        SelectNumber(
            min = 2025,
            max = 2034,
            value = formParams.cardExpireYear.toString(),
            label = "Card Expire Year",
            onValueChange = { formViewModel.onCardExpireYearChange(it.toInt()) },
        )

        FormField(
            label = "Card CVV",
            value = formParams.cardCVV,
            onValueChange = { formViewModel.onCardCVVChange(it) },
            errorMessage = "Card CVV should be 3 digits",
            keyBoardOptions = KeyboardOptions(
                keyboardType = KeyboardType.Number
            )
        )

        Button(
            onClick = {
                CoroutineScope(Dispatchers.Main).launch {
                    val ok = formViewModel.submit(viewModel::updateUserData)
                    if (ok)
                        onBackClick()
                }
            }
        ) {
            Text(text = "Submit")
        }

        Button(
            onClick = onBackClick,
            modifier = Modifier.padding(top = 16.dp)
        ) {
            Text(text = "Back")
        }
    }

}