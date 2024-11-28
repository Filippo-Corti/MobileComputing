package com.example.prima_app

import android.os.Bundle
import android.util.Log
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
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
import com.example.prima_app.ui.theme.PrimaappTheme

data class Persona(
    val nome: String,
    val cognome :String,
    val eta :Int,
    val professione :String,
    val id :Int
)

fun createPersone() :MutableList<Persona> {
    val people = mutableListOf<Persona>()
    people.add(Persona("Filippo", "Corti", 21, "Studente", 0))
    people.add(Persona("Giorgio", "Dal Santo", 21, "Astronauta", 1))
    people.add(Persona("Carlotta", "Donato", 20, "Viaggatrice", 2))
    return people;
}

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
    var screen by remember { mutableStateOf("master") }
    val persone by remember { mutableStateOf(createPersone())}
    var selectedId by remember { mutableStateOf(0)}

    when (screen) {
        "master" -> {
            return LazyColumn {
                items(persone) {
                    Row {
                        Text(text=it.nome + " ")
                        Text(text=it.cognome)
                        Button(onClick= {
                            Log.d("Main", "Click")
                            selectedId = it.id
                            screen = "detail"
                        }) {
                            Text(text="Details")
                        }
                    }
                }
            }
        }
        "detail" -> {
            val selected = persone.find { it.id == selectedId }
            if (selected == null) {
                Log.d("Main", "ERRORE MOLTO GRAVE!!")
                screen = "master"
                return
            }
            return Column {
                Text(text = selected.nome)
                Text(text = selected.cognome)
                Text(text = selected.eta.toString())
                Text(text = selected.professione)
                Text(text = selected.id.toString())

                Button(onClick = {screen = "master"}) {
                    Text(text = "Go Back")
                }
            }
        }
    }


}


@Preview(showBackground = true)
@Composable
fun GreetingPreview() {
    PrimaappTheme {
        MyApp()
    }
}