package com.example.progetto_kt

import android.content.Context
import android.os.Bundle
import android.util.Log
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.activity.viewModels
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.datastore.preferences.preferencesDataStore
import androidx.lifecycle.viewmodel.initializer
import androidx.lifecycle.viewmodel.viewModelFactory
import com.example.progetto_kt.model.datasources.PreferencesController
import com.example.progetto_kt.model.datasources.APIController
import com.example.progetto_kt.model.datasources.DBController
import com.example.progetto_kt.model.repositories.MenuRepository
import com.example.progetto_kt.model.repositories.UserRepository
import com.example.progetto_kt.view.navigation.RootNavHost
import com.example.progetto_kt.viewmodel.MainViewModel
import com.example.rprogetto_kt.model.repositories.OrderRepository

class MainActivity : ComponentActivity() {

    private val Context.dataStore by preferencesDataStore(name = "appStatus")

    override fun onCreate(savedInstanceState: Bundle?) {
        val apiController = APIController()
        val dbController = DBController(this)
        val preferencesController = PreferencesController(dataStore)

        val userRepository = UserRepository(
            apiController = apiController,
            dbController = dbController,
            preferencesController = preferencesController
        )

        val menuRepository = MenuRepository(
            apiController = apiController,
            dbController = dbController,
            preferencesController = preferencesController
        )

        val orderRepository = OrderRepository(
            apiController = apiController,
            dbController = dbController,
            preferencesController = preferencesController
        )

        super.onCreate(savedInstanceState)

        val viewModelFactory = viewModelFactory {
            initializer {
                MainViewModel(
                    userRepository,
                    menuRepository,
                    orderRepository,
                )
            }
        }
        val viewModel by viewModels<MainViewModel> { viewModelFactory }

        enableEdgeToEdge()
        setContent {
            MangiaEBasta(viewModel)
        }

    }
}

@Composable
fun MangiaEBasta(
    viewModel: MainViewModel
) {
    val state by viewModel.uiState.collectAsState()

    if (state.isLoading) {
        Log.d("MainActivity", "Loading...")
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(16.dp),
            verticalArrangement = Arrangement.Center,
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            CircularProgressIndicator()
        }
    } else {
        Log.d("MainActivity", "Loaded!")
        RootNavHost(
            viewModel = viewModel,
        )
    }
}