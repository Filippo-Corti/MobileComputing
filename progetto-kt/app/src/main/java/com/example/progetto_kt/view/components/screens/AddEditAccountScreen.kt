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
import com.example.progetto_kt.view.components.common.forms.FormField
import com.example.progetto_kt.viewmodel.AccountFormViewModel
import com.example.progetto_kt.viewmodel.MainViewModel

@Composable
fun AddEditAccountScreen(
    viewModel: MainViewModel,
    formViewModel: AccountFormViewModel,
    newAccount : Boolean = false,
    onBackClick : () -> Unit
) {

    val user by viewModel.user.collectAsState()

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

        FormField(
            label = "Card Expire Month",
            value = formParams.cardExpireMonth.toString(),
            onValueChange = { formViewModel.onCardExpireMonthChange(it.toInt()) },
            errorMessage = "Card Expire Month should be between 1 and 12",
            keyBoardOptions = KeyboardOptions(
                keyboardType = KeyboardType.Number
            )
        )

        FormField(
            label = "Card Expire Year",
            value = formParams.cardExpireYear.toString(),
            onValueChange = { formViewModel.onCardExpireYearChange(it.toInt()) },
            errorMessage = "Card Expire Year should be > 0",
            keyBoardOptions = KeyboardOptions(
                keyboardType = KeyboardType.Number
            )
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
            onClick = { formViewModel.submit() }
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