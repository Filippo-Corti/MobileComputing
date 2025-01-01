package com.example.progetto_kt.viewmodel

import android.util.Log
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.progetto_kt.model.dataclasses.Menu
import com.example.progetto_kt.model.dataclasses.MenuDetails
import com.example.progetto_kt.model.dataclasses.MenuDetailsWithImage
import com.example.progetto_kt.model.dataclasses.Order
import com.example.progetto_kt.model.dataclasses.User
import com.example.progetto_kt.model.dataclasses.UserUpdateParams
import com.example.progetto_kt.model.repositories.UserRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch
import java.util.Calendar

class AccountFormViewModel(
    private val userRepository: UserRepository,
    initValues : User? = null,
) : ViewModel() {

    private val TAG = MainViewModel::class.simpleName
    private val _sid = MutableStateFlow<String?>(null)
    private val _uid = MutableStateFlow<Int?>(null)

    private val _formParams = MutableStateFlow(
        UserUpdateParams(
            firstName = initValues?.firstName ?: "",
            lastName = initValues?.lastName ?: "",
            cardFullName = initValues?.cardFullName ?: "",
            cardNumber = initValues?.cardNumber ?: "",
            cardExpireMonth = initValues?.cardExpireMonth ?: 1,
            cardExpireYear = initValues?.cardExpireYear ?: 2025,
            cardCVV = initValues?.cardCVV ?: "",
            sid = ""
        )
    )

    val formParams : StateFlow<UserUpdateParams> = _formParams

    init {
        viewModelScope.launch {
            fetchSessionData()
        }
    }

    fun fetchSessionData() {
        viewModelScope.launch {
            val us = userRepository.getUserSession()
            _sid.value = us.sid
            _uid.value = us.uid
            Log.d(TAG, "SID is ${_sid.value} and UID is ${_uid.value}")
        }
    }

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

        return (value.length == 16 && value.toLongOrNull() != null)
    }

    fun onCardExpireMonthChange(value : Int) : Boolean {
        Log.d(TAG, "Card Expire Month Changed: $value")
        _formParams.value = _formParams.value.copy(cardExpireMonth = value)

        return (value in 1..12)
    }

    fun onCardExpireYearChange(value : Int) : Boolean {
        Log.d(TAG, "Card Expire Year Changed: $value")
        _formParams.value = _formParams.value.copy(cardExpireYear = value)

        return (value >= Calendar.getInstance().get(Calendar.YEAR))
    }

    fun onCardCVVChange(value : String) : Boolean {
        Log.d(TAG, "Card CVV Changed: $value")
        _formParams.value = _formParams.value.copy(cardCVV = value)

        return (value.length == 3 && value.toIntOrNull() != null)
    }

    suspend fun submit(submitCb : suspend (UserUpdateParams) -> Boolean) : Boolean {
        Log.d(TAG, "Submitting with values: ${_formParams.value}")
        if (_formParams.value.firstName.isEmpty() || _formParams.value.lastName.isEmpty() ||
            _formParams.value.cardFullName.isEmpty() || _formParams.value.cardNumber.isEmpty() ||
            _formParams.value.cardCVV.isEmpty()) {
            Log.d(TAG, "Invalid Form Data")
            return false
        }

        return submitCb(_formParams.value)
    }


}