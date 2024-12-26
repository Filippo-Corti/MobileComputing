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
import androidx.compose.material3.Button
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.ModalBottomSheet
import androidx.compose.material3.Text
import androidx.compose.material3.rememberModalBottomSheetState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
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
import kotlinx.coroutines.launch

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

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MangiaEBasta(
    viewModel: MainViewModel
) {
    val state by viewModel.uiState.collectAsState()
    val error = state.error
    val sheetState = rememberModalBottomSheetState()
    val scope = rememberCoroutineScope()
    var showBottomSheet = error != null

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
        if (showBottomSheet) {
            Log.d("MainActivity", "With Error!")
            ModalBottomSheet(
                onDismissRequest = {
                    viewModel.resetError()
                    Log.d("MainActivity", "Bottom Sheet Dismissed")
                },
                sheetState = sheetState
            ) {
                Column {
                    Text(
                        text = "Title: ${error!!.title}",
                    )

                    Text(
                        text = "Message: ${error.message}",
                    )

                    if (error.actionText != null) {
                        Button(
                            onClick = {
                                scope.launch { sheetState.hide() }.invokeOnCompletion {
                                    viewModel.resetError()
                                    if (!sheetState.isVisible) {
                                        showBottomSheet = false
                                    }
                                }
                                // Differentiate between different error.types
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
                                viewModel.resetError()
                                if (!sheetState.isVisible) {
                                    showBottomSheet = false
                                }
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
    }
}