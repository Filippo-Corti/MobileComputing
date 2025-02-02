package com.example.progetto_kt.model.datasources

import android.net.Uri
import android.util.Log
import com.example.progetto_kt.model.dataclasses.APIError
import com.example.progetto_kt.model.dataclasses.BuyOrderRequest
import com.example.progetto_kt.model.dataclasses.Error
import com.example.progetto_kt.model.dataclasses.ErrorType
import com.example.progetto_kt.model.dataclasses.APILocation
import com.example.progetto_kt.model.dataclasses.Ingredient
import com.example.progetto_kt.model.dataclasses.Menu
import com.example.progetto_kt.model.dataclasses.MenuDetails
import com.example.progetto_kt.model.dataclasses.MenuImage
import com.example.progetto_kt.model.dataclasses.Order
import com.example.progetto_kt.model.dataclasses.User
import com.example.progetto_kt.model.dataclasses.UserSession
import com.example.progetto_kt.model.dataclasses.UserUpdateParams
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

class APIController(

) {
    companion object {
        private val BASE_URL = "https://develop.ewlab.di.unimi.it/mc/2425/"
        private val TAG = APIController::class.simpleName

        enum class HttpMethod {
            GET,
            POST,
            DELETE,
            PUT
        }
    }

    private val client = HttpClient(Android) {
        install(ContentNegotiation) {
            json(Json {
                ignoreUnknownKeys = true
            })
        }
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
            else -> throw Error(
                type = ErrorType.NETWORK,
                title = "Unexpected Error",
                message = "Something wrong happened contacting the server: \n${(httpResponse.body() as APIError).message} \nPlease try closing and re-opening the app."
            )
        }
    }

    suspend fun getUserDetails(sid : String, userId : Int) : User {
        Log.d(TAG, "Getting User Details")

        val httpResponse = genericRequest(
            endpoint = "user/$userId",
            method = HttpMethod.GET,
            queryParams = mapOf("sid" to sid)
        )

        when (httpResponse.status.value) {
            200 -> return httpResponse.body() as User
            401 -> throw Error(
                type = ErrorType.NETWORK,
                title = "Authentication Error",
                message = "We couldn't authenticate you, please try un-installing and re-installing the app."
            )
            404 -> throw Error(
                type = ErrorType.NETWORK,
                title = "This User doesn't Exist",
                message = "We couldn't find the user you're looking for. Please consider un-installing and re-installing the app."
            )
            else -> throw Error(
                type = ErrorType.NETWORK,
                title = "Unexpected Error",
                message = "Something wrong happened contacting the server: \n${(httpResponse.body() as APIError).message} \nPlease try closing and re-opening the app."
            )
        }
    }

    suspend fun updateUserDetails(sid : String, userId : Int, user : UserUpdateParams) {
        Log.d(TAG, "Updating User Details")

        val httpResponse = genericRequest(
            endpoint = "user/${userId}",
            method = HttpMethod.PUT,
            bodyParams = user,
            queryParams = mapOf("sid" to sid)
        )

        when (httpResponse.status.value) {
            204 -> return
            401 -> throw Error(
                type = ErrorType.NETWORK,
                title = "Authentication Error",
                message = "We couldn't authenticate you, please try un-installing and re-installing the app."
            )
            404 -> throw Error(
                type = ErrorType.NETWORK,
                title = "This User doesn't Exist",
                message = "We couldn't find the user you're looking for. Please consider un-installing and re-installing the app."
            )
            else -> throw Error(
                type = ErrorType.NETWORK,
                title = "Unexpected Error",
                message = "Something wrong happened contacting the server: \n${(httpResponse.body() as APIError).message} \nPlease try closing and re-opening the app."
            )
        }
    }

    suspend fun getOrderDetails(sid : String, orderId : Int) : Order {
        Log.d(TAG, "Getting Order Details for order $orderId")

        val httpResponse = genericRequest(
            endpoint = "order/${orderId}",
            method = HttpMethod.GET,
            queryParams = mapOf("sid" to sid)
        )

        when (httpResponse.status.value) {
            200 -> return httpResponse.body() as Order
            401 -> throw Error(
                type = ErrorType.NETWORK,
                title = "Authentication Error",
                message = "We couldn't authenticate you, please try un-installing and re-installing the app."
            )
            404 -> throw Error(
                type = ErrorType.NETWORK,
                title = "This Order doesn't Exist",
                message = "We couldn't find the order you're looking for. Please consider closing and re-opening the app."
            )
            else -> throw Error(
                type = ErrorType.NETWORK,
                title = "Unexpected Error",
                message = "Something wrong happened contacting the server: \n${(httpResponse.body() as APIError).message} \nPlease try closing and re-opening the app."
            )
        }
    }

    suspend fun orderMenu(sid : String, menuId : Int, deliveryLocation : APILocation) : Order {
        Log.d(TAG, "Creating a new Order for menu $menuId")

        val httpResponse = genericRequest(
            endpoint = "menu/${menuId}/buy",
            method = HttpMethod.POST,
            bodyParams = BuyOrderRequest(sid, deliveryLocation)
        )

        when (httpResponse.status.value) {
            200 -> return httpResponse.body() as Order
            401 -> throw Error(
                type = ErrorType.NETWORK,
                title = "Authentication Error",
                message = "We couldn't authenticate you, please try un-installing and re-installing the app."
            )
            403 -> throw Error(
                type = ErrorType.ACCOUNT_DETAILS,
                title = "Your Credit Card is invalid",
                message = "We couldn't validate the credit card you provided. Please check the details and try again.",
                actionText = "Check Card Details"
            )
            404 -> throw Error(
                type = ErrorType.NETWORK,
                title = "This Menu doesn't Exist",
                message = "We couldn't find the menu you're looking for. Please consider closing and re-opening the app or picking another menu."
            )
            409 -> throw Error(
                type = ErrorType.INVALID_ACTION,
                title = "An Order is already on its way",
                message = "You already have an active order. Please wait for it to be delivered before ordering again."
            )
            else -> throw Error(
                type = ErrorType.NETWORK,
                title = "Unexpected Error",
                message = "Something wrong happened contacting the server: \n${(httpResponse.body() as APIError).message} \nPlease try closing and re-opening the app."
            )
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
            401 -> throw Error(
                type = ErrorType.NETWORK,
                title = "Authentication Error",
                message = "We couldn't authenticate you, please try un-installing and re-installing the app."
            )
            else -> throw Error(
                type = ErrorType.NETWORK,
                title = "Unexpected Error",
                message = "Something wrong happened contacting the server: \n${(httpResponse.body() as APIError).message} \nPlease try closing and re-opening the app."
            )
        }
    }


    suspend fun getMenuDetails(sid : String, latitude : Double, longitude : Double, menuId : Int) : MenuDetails {
        Log.d(TAG, "Getting Menu Details for menu $menuId")

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
            401 -> throw Error(
                type = ErrorType.NETWORK,
                title = "Authentication Error",
                message = "We couldn't authenticate you, please try un-installing and re-installing the app."
            )
            404 -> throw Error(
                type = ErrorType.NETWORK,
                title = "This Menu doesn't Exist",
                message = "We couldn't find the menu you're looking for. Please consider closing and re-opening the app or picking another menu."
            )
            else -> throw Error(
                type = ErrorType.NETWORK,
                title = "Unexpected Error",
                message = "Something wrong happened contacting the server: \n${(httpResponse.body() as APIError).message} \nPlease try closing and re-opening the app."
            )
        }
    }

    suspend fun getMenuImage(sid : String, menuId : Int) : MenuImage {
        Log.d(TAG, "Getting Menu Image")

        val httpResponse = genericRequest(
            endpoint = "menu/$menuId/image",
            method = HttpMethod.GET,
            queryParams = mapOf(
                "sid" to sid
            )
        )

        when (httpResponse.status.value) {
            200 -> return httpResponse.body() as MenuImage
            401 -> throw Error(
                type = ErrorType.NETWORK,
                title = "Authentication Error",
                message = "We couldn't authenticate you, please try un-installing and re-installing the app."
            )
            404 -> return MenuImage("") // Graceful Degradation
            else -> throw Error(
                type = ErrorType.NETWORK,
                title = "Unexpected Error",
                message = "Something wrong happened contacting the server: \n${(httpResponse.body() as APIError).message} \nPlease try closing and re-opening the app."
            )
        }
    }

    suspend fun getMenuIngredients(sid : String, menuId : Int) : List<Ingredient> {
        Log.d(TAG, "Getting Ingredients for menu $menuId")

        val httpResponse = genericRequest(
            endpoint = "menu/$menuId/ingredients",
            method = HttpMethod.GET,
            queryParams = mapOf(
                "sid" to sid,
            )
        )

        when (httpResponse.status.value) {
            200 -> return httpResponse.body() as List<Ingredient>
            401 -> throw Error(
                type = ErrorType.NETWORK,
                title = "Authentication Error",
                message = "We couldn't authenticate you, please try un-installing and re-installing the app."
            )
            404 -> throw Error(
                type = ErrorType.NETWORK,
                title = "This Menu doesn't Exist",
                message = "We couldn't find the menu you're looking for. Please consider closing and re-opening the app or picking another menu."
            )
            else -> throw Error(
                type = ErrorType.NETWORK,
                title = "Unexpected Error",
                message = "Something wrong happened contacting the server: \n${(httpResponse.body() as APIError).message} \nPlease try closing and re-opening the app."
            )
        }
    }

}