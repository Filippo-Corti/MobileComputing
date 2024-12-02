package com.example.navigation_app

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Button
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import com.example.navigation_app.components.AccountScreen
import com.example.navigation_app.components.HomeScreen
import com.example.navigation_app.ui.theme.NavigationappTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            MyApp()
        }
    }
}

@Composable
fun MyApp() {
    var screen by remember { mutableStateOf("home") }

    val updateScreen = {screenName :String -> screen = screenName}

    Scaffold(
        modifier = Modifier.fillMaxSize(),
        bottomBar = {
            BottomTabNav(screen, updateScreen)
        }
    ) { padding ->
        Screen(screen, Modifier.padding(padding))
    }

}

@Composable
fun Screen(screen :String, modifier : Modifier = Modifier) {
    when (screen) {
        "home" -> return HomeScreen()
        "account" -> return AccountScreen()
    }
}

@Composable
fun BottomTabNav(screen :String, updateScreen :(String) -> Unit) {
    Row (
      modifier = Modifier
          .fillMaxWidth()
          .padding(8.dp),
      horizontalArrangement = Arrangement.SpaceEvenly
    ) {
        Button(onClick = {updateScreen("home")}) {
            Text("Home")
        }
        Button(onClick = {updateScreen("account")}) {
            Text("Account")
        }
    }
}

@Preview(showBackground = true)
@Composable
fun AppPreview() {
    MyApp()
}