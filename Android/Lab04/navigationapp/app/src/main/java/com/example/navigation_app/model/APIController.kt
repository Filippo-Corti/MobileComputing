package com.example.navigation_app.model


import android.net.Uri
import android.util.Log
import com.example.navigation_app.model.types.UserSession
import io.ktor.client.HttpClient
import io.ktor.client.call.body
import io.ktor.client.engine.android.Android
import io.ktor.client.plugins.contentnegotiation.ContentNegotiation
import io.ktor.client.request.HttpRequestBuilder
import io.ktor.client.request.delete
import io.ktor.client.request.get
import io.ktor.client.request.post
import io.ktor.client.request.put
import io.ktor.client.request.setBody
import io.ktor.client.statement.HttpResponse
import io.ktor.http.ContentType
import io.ktor.http.contentType
import io.ktor.serialization.kotlinx.json.json
import kotlinx.serialization.json.Json
import kotlin.reflect.KClass

object APIController {

    private val BASE_URL = "https://develop.ewlab.di.unimi.it/mc/2425/"
    var sid : String? = null
    private val TAG = APIController::class.simpleName

    private val client = HttpClient(Android) {
        install(ContentNegotiation) {
            json(Json {
                ignoreUnknownKeys = true
            })
        }
    }

    enum class HttpMethod {
        GET,
        POST,
        DELETE,
        PUT
    }

    suspend fun genericRequest(
        endpoint: String,
        method: HttpMethod,
        bodyParams: Any? = null,
        queryParameters: Map<String, Any> = emptyMap(),
    ) : HttpResponse {

        val urlUri = Uri.parse(BASE_URL + endpoint)
        val urlBuilder = urlUri.buildUpon()
        queryParameters.forEach { (key, value) ->
            urlBuilder.appendQueryParameter(key, value.toString())
        }
        val completeUrlString = urlBuilder.build().toString()

        Log.d(TAG, completeUrlString)

        val request: HttpRequestBuilder.() -> Unit = {
            bodyParams?.let {
                contentType(ContentType.Application.Json)
                setBody(bodyParams)
            }
        }

        val httpResponse = when (method) {
            HttpMethod.GET -> client.get(completeUrlString, request)
            HttpMethod.POST -> client.post(completeUrlString, request)
            HttpMethod.DELETE -> client.delete(completeUrlString, request)
            HttpMethod.PUT -> client.put(completeUrlString, request)
        }
        return httpResponse
    }

    suspend fun createNewUserSession(): UserSession {
        Log.d(TAG, "Creating New User Session")

        val httpResponse = genericRequest("user", HttpMethod.POST)
        //TODO: aggiungere il controllo degli errori
        val result : UserSession = httpResponse.body()
        return result
    }

}

