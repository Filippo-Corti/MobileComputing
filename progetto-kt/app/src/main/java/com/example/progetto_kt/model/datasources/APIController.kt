package com.example.progetto_kt.model.datasources

import android.net.Uri
import android.util.Log
import com.example.progetto_kt.model.dataclasses.Menu
import com.example.progetto_kt.model.dataclasses.MenuDetails
import com.example.progetto_kt.model.dataclasses.MenuImage
import com.example.progetto_kt.model.dataclasses.UserSession
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

object APIController {

    private val BASE_URL = "https://develop.ewlab.di.unimi.it/mc/2425/"
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

    private suspend fun genericRequest(
        endpoint: String,
        method: HttpMethod,
        bodyParams: Any? = null,
        queryParams: Map<String, Any> = emptyMap(),
    ) : HttpResponse {

        val urlUri = Uri.parse(BASE_URL + endpoint)
        val urlBuilder = urlUri.buildUpon()
        queryParams.forEach { (key, value) ->
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

        val httpResponse = genericRequest(
            endpoint = "user",
            method = HttpMethod.POST)

        when (httpResponse.status.value) {
            200 -> return httpResponse.body() as UserSession
            else -> throw Exception("Unexpected status code ${httpResponse.status.value} from the API")
        }
    }

    suspend fun getNearbyMenus(sid : String, latitude : Double, longitude : Double) : List<Menu> {
        Log.d(TAG, "Getting Nearby Menus")

        val httpResponse = genericRequest(
            endpoint = "menu",
            method = HttpMethod.GET,
            queryParams = mapOf(
                "sid" to sid,
                "lat" to latitude,
                "lng" to longitude
            )
        )

        when (httpResponse.status.value) {
            200 -> return httpResponse.body() as List<Menu>
            401 -> throw Exception("Unauthorized")
            else -> throw Exception("Unexpected status code ${httpResponse.status.value} from the API")
        }
    }


    suspend fun getMenuDetails(sid : String, latitude : Double, longitude : Double, menuId : Int) : MenuDetails {
        Log.d(TAG, "Getting Nearby Menus")

        val httpResponse = genericRequest(
            endpoint = "menu/$menuId",
            method = HttpMethod.GET,
            queryParams = mapOf(
                "sid" to sid,
                "lat" to latitude,
                "lng" to longitude
            )
        )

        when (httpResponse.status.value) {
            200 -> return httpResponse.body() as MenuDetails
            401 -> throw Exception("Unauthorized")
            else -> throw Exception("Unexpected status code ${httpResponse.status.value} from the API")
        }
    }

    suspend fun getMenuImage(sid : String, menuId : Int) : MenuImage {
        Log.d(TAG, "Getting Menu Image")

        val httpResponse = genericRequest(
            endpoint = "menu/$menuId/image",
            method = HttpMethod.GET,
            queryParams = mapOf(
                "sid" to sid,
                "mid" to menuId
            )
        )

        when (httpResponse.status.value) {
            200 -> return httpResponse.body() as MenuImage
            401 -> throw Exception("Unauthorized")
            404 -> throw Exception("Image not found")
            else -> throw Exception("Unexpected status code ${httpResponse.status.value} from the API")
        }
    }

}