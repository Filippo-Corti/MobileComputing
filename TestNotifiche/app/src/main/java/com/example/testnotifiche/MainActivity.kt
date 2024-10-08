package com.example.testnotifiche

import android.Manifest
import android.content.pm.PackageManager
import android.os.Build
import android.os.Bundle
import android.util.Log
import android.widget.Toast
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.tooling.preview.Preview
import androidx.core.content.ContextCompat
import com.example.testnotifiche.ui.theme.TestNotificheTheme
import com.google.android.gms.common.GoogleApiAvailability
import com.google.android.gms.tasks.OnCompleteListener
import com.google.firebase.Firebase
import com.google.firebase.messaging.FirebaseMessaging

class MainActivity : ComponentActivity() {
    companion object {
        private val TAG = MainActivity::class.java.simpleName
    }

    private var token = "NOT YET AVAILABLE"

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        GoogleApiAvailability.getInstance().makeGooglePlayServicesAvailable(this)

        enableEdgeToEdge()

        setContent {
            TestNotificheTheme {
                Scaffold(modifier = Modifier.fillMaxSize()) { innerPadding ->
                    Column {
                        Greeting(
                            name = "Android",
                            modifier = Modifier.padding(innerPadding)
                        )
                        Token(token = token)
                    }
                }
            }
        }
    }

    override fun onResume() {
        super.onResume()

        GoogleApiAvailability.getInstance().makeGooglePlayServicesAvailable(this)
        askNotificationPermission()
    }

    fun onPermissionGranted() {
        FirebaseMessaging.getInstance().token.addOnCompleteListener(OnCompleteListener { task ->
            if (!task.isSuccessful) {
                Log.d(TAG, "Fetching FCM registration token failed", task.exception)
                return@OnCompleteListener
            }

            // Get new FCM registration token
            this.token = task.result

            // Log and toast the token
            Log.d(TAG, "Your token: $token")
            Toast.makeText(baseContext, token, Toast.LENGTH_SHORT).show()
        })
    }



    // Declare the launcher at the top of your Activity/Fragment:
    private val requestPermissionLauncher = registerForActivityResult(
        ActivityResultContracts.RequestPermission(),
    ) { isGranted: Boolean ->
        if (isGranted) {
            Log.d(TAG, "Notification permission granted")
            onPermissionGranted()
        } else {
            Log.d(TAG, "Notification permission not granted")
        }
    }

    private fun askNotificationPermission() {
        // This is only necessary for API level >= 33 (TIRAMISU)
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.TIRAMISU)
            return

        if (ContextCompat.checkSelfPermission(this, Manifest.permission.POST_NOTIFICATIONS) ==
            PackageManager.PERMISSION_GRANTED
        ) {
            onPermissionGranted()
            // FCM SDK (and your app) can post notifications.
        } else
            requestPermissionLauncher.launch(Manifest.permission.POST_NOTIFICATIONS)
    }
}

@Composable
fun Greeting(name: String, modifier: Modifier = Modifier) {
    Text(
        text = "Hello $name!",
        modifier = modifier
    )
}

@Composable
fun Token(token: String) {
    Text(text = "Your token: $token")
}

@Preview(showBackground = true)
@Composable
fun GreetingPreview() {
    TestNotificheTheme {
        Column {
            Greeting("Mobile Computing")
            Token("TOKEN")
        }
    }
}