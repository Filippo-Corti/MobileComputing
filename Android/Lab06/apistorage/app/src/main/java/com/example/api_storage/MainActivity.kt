package com.example.api_storage

import android.content.Context
import android.os.Bundle
import android.util.Log
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.Button
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.datastore.core.DataStore
import androidx.datastore.preferences.core.Preferences
import androidx.datastore.preferences.preferencesDataStore
import androidx.lifecycle.ViewModel
import com.example.api_storage.model.DBController
import com.example.api_storage.model.types.MenuDetails
import com.example.api_storage.model.PreferencesController
import com.example.api_storage.model.types.MenuImageWithVersion
import com.example.api_storage.viewmodel.MainViewModel
import com.example.navigation_app.model.APIController
import com.example.navigation_app.model.types.UserSession
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

class MainActivity : ComponentActivity() {

    private val Context.dataStore by preferencesDataStore(name = "appStatus")

    override fun onCreate(savedInstanceState: Bundle?) {
        DBController.initDB(this)

        val viewModel = MainViewModel(dataStore)
        viewModel.fetchLaunchInformation()

        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            MyApp(viewModel)
        }
    }
}

@Composable
fun MyApp(
    viewModel: MainViewModel
) {

    val sid = viewModel.sid.collectAsState()
    val uid = viewModel.uid.collectAsState()

    Column (
        modifier = Modifier
            .fillMaxSize(),
        verticalArrangement = Arrangement.Center,
        horizontalAlignment = Alignment.CenterHorizontally
    ){

        Text(
            text = "Hello ${sid.value} - ${uid.value}"
        )

       /* Button(
          onClick = {
              Log.d("MainActivity", "Clicked")
              CoroutineScope(Dispatchers.IO).launch {
                  try {
                      val us : UserSession = APIController.createNewUserSession()
                      PreferencesController.memorizeSessionKeys(dataStore, us.sid, us.uid)
                      withContext(Dispatchers.Main) {
                          responseText = us.toString()
                      }
                      Log.d("MainActivity", "SID is: ${us.sid}")
                  } catch (e : Exception) {
                      Log.e("MainActivity", "Error creating a new User Session: $e")
                  }
              }
          }
        ) {
            Text(
                text = "New Session"
            )
        }

        Button(
            onClick = {
                Log.d("MainActivity", "Clicked")
                CoroutineScope(Dispatchers.IO).launch {
                    try {
                        val sid = PreferencesController.get(dataStore, PreferencesController.KEYS_SID)
                        Log.d("MainActivity", "SID is: $sid")
                        val uid = PreferencesController.get(dataStore, PreferencesController.KEYS_UID)
                        Log.d("MainActivity", "UID is: $uid")
                    } catch (e : Exception) {
                        Log.e("MainActivity", "Error reading SID and UID: $e")
                    }
                }
            }
        ) {
            Text(
                text = "Read SID from Memory"
            )
        }

        Button(
            onClick = {
                Log.d("MainActivity", "Clicked")
                CoroutineScope(Dispatchers.IO).launch {
                    try {
                        val menu : MenuDetails? = APIController.getMenuDetails(12)
                        withContext(Dispatchers.Main) {
                            responseText = menu.toString()
                        }
                        Log.d("MainActivity", "MenuDetails is: $menu")
                    } catch (e : Exception) {
                        Log.e("MainActivity", "Error fetching a Menu: $e")
                    }
                }
            }
        ) {
            Text(
                text = "Get Menu 12"
            )
        }


        Button(
            onClick = {
                Log.d("MainActivity", "Clicked" )
                CoroutineScope(Dispatchers.IO).launch {
                    try {
                        DBController.dao.insertMenuImage(MenuImageWithVersion(8, 1, "imageimageimage"))
                        Log.d("MainActivity", "Inserted Dummy Image")
                    } catch (e : Exception) {
                        Log.e("MainActivity", "Error fetching a Menu: $e")
                    }
                }
            }
        ) {
            Text(
                text = "Add Dummy Image to DB"
            )
        }

        Button(
            onClick = {
                Log.d("MainActivity", "Clicked")
                CoroutineScope(Dispatchers.IO).launch {
                    try {
                        val data = DBController.dao.getMenuImageByVersion(8, 1)
                        Log.d("MainActivity", "Data Fetched from DB is ${data.size}: ${data[0]}")
                    } catch (e : Exception) {
                        Log.e("MainActivity", "Error fetching a Menu: $e")
                    }
                }
            }
        ) {
            Text(
                text = "Get Dummy Image from DB"
            )
        }
        Text(
            text = "Result: $responseText"
        )*/
    }

}