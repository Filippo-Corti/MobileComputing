package com.example.progetto_kt.viewmodel

import android.util.Log
import androidx.lifecycle.ViewModel
import com.example.progetto_kt.model.dataclasses.User
import com.example.progetto_kt.model.dataclasses.UserUpdateParams
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow

class AccountFormViewModel(
    private val mainViewModel: MainViewModel,
    private val initValues : User? = null,
) : ViewModel() {

    private val TAG = MainViewModel::class.simpleName

    private val _formParams = MutableStateFlow<UserUpdateParams>(
        UserUpdateParams(
            firstName = initValues?.firstName ?: "",
            lastName = initValues?.lastName ?: "",
            cardFullName = initValues?.creditCard?.fullName ?: "",
            cardNumber = initValues?.creditCard?.number ?: "",
            cardExpireMonth = initValues?.creditCard?.expireMonth ?: 1,
            cardExpireYear = initValues?.creditCard?.expireYear ?: 2025,
            cardCVV = initValues?.creditCard?.cvv ?: ""
        )
    )

    val formParams : StateFlow<UserUpdateParams> = _formParams

    fun onFirstNameChange(value : String) : Boolean {
        Log.d(TAG, "First Name Changed: $value")
        _formParams.value = _formParams.value.copy(firstName = value)

        return !(value.length > 15 || value.isEmpty())
    }

    fun onLastNameChange(value : String) : Boolean {
        Log.d(TAG, "Last Name Changed: $value")
        _formParams.value = _formParams.value.copy(lastName = value)

        return !(value.length > 15 || value.isEmpty())
    }

    fun onCardFullNameChange(value : String) : Boolean {
        Log.d(TAG, "Card Full Name Changed: $value")
        _formParams.value = _formParams.value.copy(cardFullName = value)

        return !(value.length > 31 || value.isEmpty())
    }

    fun onCardNumberChange(value : String) : Boolean {
        Log.d(TAG, "Card Number Changed: $value")
        _formParams.value = _formParams.value.copy(cardNumber = value)

        return (value.length == 16 && value.toIntOrNull() != null)
    }

    fun onCardExpireMonthChange(value : Int) : Boolean {
        Log.d(TAG, "Card Expire Month Changed: $value")
        _formParams.value = _formParams.value.copy(cardExpireMonth = value)

        return (value in 1..12)
    }

    fun onCardExpireYearChange(value : Int) : Boolean {
        Log.d(TAG, "Card Expire Year Changed: $value")
        _formParams.value = _formParams.value.copy(cardExpireYear = value)

        return (value > 0)
    }

    fun onCardCVVChange(value : String) : Boolean {
        Log.d(TAG, "Card CVV Changed: $value")
        _formParams.value = _formParams.value.copy(cardCVV = value)

        return (value.length == 3 && value.toIntOrNull() != null)
    }


    fun submit() {
        Log.d(TAG, "Submitted with values: ${_formParams.value}")
    }

}