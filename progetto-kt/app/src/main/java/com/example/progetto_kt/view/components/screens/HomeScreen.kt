package com.example.progetto_kt.view.components.screens

import MyLogo
import android.graphics.BitmapFactory
import android.util.Log
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.defaultMinSize
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.lazy.rememberLazyListState
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Text
import androidx.compose.material3.pulltorefresh.PullToRefreshBox
import androidx.compose.material3.pulltorefresh.rememberPullToRefreshState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.asImageBitmap
import androidx.compose.ui.graphics.painter.BitmapPainter
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.Font
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.progetto_kt.R
import com.example.progetto_kt.model.dataclasses.APILocation
import com.example.progetto_kt.model.dataclasses.Error
import com.example.progetto_kt.model.dataclasses.ErrorType
import com.example.progetto_kt.model.dataclasses.User
import com.example.progetto_kt.model.dataclasses.toPoint
import com.example.progetto_kt.view.components.common.buttons.ButtonWithArrow
import com.example.progetto_kt.view.components.common.buttons.LargeButton
import com.example.progetto_kt.view.components.common.buttons.MinimalistButton
import com.example.progetto_kt.view.components.common.forms.FormField
import com.example.progetto_kt.view.components.common.forms.SelectNumber
import com.example.progetto_kt.view.components.common.icons.IconNames
import com.example.progetto_kt.view.components.common.other.CardInformation
import com.example.progetto_kt.view.components.common.other.CreditCard
import com.example.progetto_kt.view.components.common.other.InfoTextBox
import com.example.progetto_kt.view.components.common.other.MenuPreview
import com.example.progetto_kt.view.components.common.other.MenuSmallPreview
import com.example.progetto_kt.view.components.common.other.ProgressBar
import com.example.progetto_kt.view.components.common.other.Separator
import com.example.progetto_kt.view.components.common.other.SplashScreen
import com.example.progetto_kt.view.styles.Colors
import com.example.progetto_kt.view.styles.Global
import com.example.progetto_kt.viewmodel.MainViewModel
import com.example.progetto_kt.viewmodel.util.CustomMarkerBuilder
import com.mapbox.maps.extension.compose.MapEffect
import com.mapbox.maps.extension.compose.MapboxMap
import com.mapbox.maps.extension.compose.animation.viewport.rememberMapViewportState
import com.mapbox.maps.extension.compose.annotation.generated.PointAnnotation
import com.mapbox.maps.extension.compose.annotation.rememberIconImage
import com.mapbox.maps.plugin.PuckBearing
import com.mapbox.maps.plugin.gestures.gestures
import com.mapbox.maps.plugin.locationcomponent.createDefault2DPuck
import com.mapbox.maps.plugin.locationcomponent.location
import com.mapbox.maps.plugin.viewport.data.FollowPuckViewportStateOptions
import kotlinx.coroutines.launch
import kotlin.io.encoding.Base64
import kotlin.io.encoding.ExperimentalEncodingApi


@Suppress("Deprecation")
@OptIn(ExperimentalEncodingApi::class, ExperimentalMaterial3Api::class)
@Composable
fun HomeScreen(
    viewModel: MainViewModel,
    onMenuClick: (Int) -> Unit
) {

    val appState by viewModel.appState.collectAsState()
    val userState by viewModel.userState.collectAsState()
    val locationState by viewModel.locationState.collectAsState()
    val menusState by viewModel.menusExplorationState.collectAsState()

    // Pull to Refresh
    var isRefreshing by remember { mutableStateOf(false) }
    val refreshState = rememberPullToRefreshState()
    val onRefresh: () -> Unit = {
        isRefreshing = true
        Log.d("HomeScreen", "Fetching menus onRefresh")
        viewModel.fetchNearbyMenusAsync {
            isRefreshing = false
        }
    }

    LaunchedEffect(menusState.reloadMenus, appState.isLoading) {
        Log.d("HomeScreen", "Triggered: ${menusState.reloadMenus} ${appState.isLoading}")
        if (menusState.nearbyMenus.isEmpty() && !appState.isLoading || menusState.reloadMenus) {
            isRefreshing = true
            viewModel.fetchNearbyMenusAsync {
                isRefreshing = false
            }
        }
    }

    if (appState.isLoading) {
        return Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(16.dp)
                .background(Colors.WHITE),
            verticalArrangement = Arrangement.Center,
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            CircularProgressIndicator()
        }
    }

    PullToRefreshBox(
        isRefreshing = isRefreshing,
        state = refreshState,
        onRefresh = onRefresh
    ) {
        LazyColumn(
            modifier = Global.Container
                .defaultMinSize(minHeight = 100.dp),
            verticalArrangement = Arrangement.spacedBy(8.dp)
        ) {

            item {

                Header(user = userState.user)

                MenusListHeader(
                    location = locationState.lastKnownLocation,
                    onEnableLocationClick = {
                        viewModel.setError(
                            Error(
                                type = ErrorType.POSITION_UNALLOWED,
                                title = "We need your Location",
                                message = "This app requires your location to work properly. \nIn case you deny the permission, some features may not work as expected.",
                                actionText = "I'll do it"
                            )
                        )
                    }
                )

                Separator(size = 1, color = Colors.LIGHT_GRAY)

            }

            items(menusState.nearbyMenus) { menu ->

                MenuPreview(
                    viewModel = viewModel,
                    menu = menu,
                    onPress = {
                        onMenuClick(menu.menu.id)
                    }
                )

            }
        }
    }
}

@Composable
fun Header(
    user: User?
) {
    val userName = if (user != null) ",${user.firstName}" else ""

    Row(
        modifier = Global.InsetContainer
            .padding(top = 22.dp, bottom = 10.dp)
            .padding(horizontal = 8.dp),
        horizontalArrangement = Arrangement.SpaceBetween
    ) {
        Column {
            Text(
                text = "Welcome back $userName",
                color = Colors.BLACK,
                fontFamily = Global.Fonts.Medium,
                fontSize = Global.FontSizes.Subtitle
            )

            Text(
                text = "What are you craving?",
                color = Colors.DARK_GRAY,
                fontFamily = Global.Fonts.Regular,
                fontSize = Global.FontSizes.Normal
            )
        }

        Column {
            MyLogo()
        }
    }
}

@Composable
fun MenusListHeader(
    location: APILocation?,
    onEnableLocationClick: () -> Unit
) {

    Column(
        modifier = Global.InsetContainer
            .padding(top = 10.dp, bottom = 15.dp),
        verticalArrangement = Arrangement.Center,
        horizontalAlignment = Alignment.CenterHorizontally
    ) {

        if (location == null) {
            Text(
                text = "Menus in ${MainViewModel.DEFAULT_LOCATION.address}",
                color = Colors.BLACK,
                fontFamily = Global.Fonts.Bold,
                fontSize = Global.FontSizes.Subtitle,
                modifier = Modifier.padding(bottom = 10.dp)
            )

            Text(
                text = "Want localized results?",
                color = Colors.DARK_GRAY,
                fontFamily = Global.Fonts.Regular,
                fontSize = Global.FontSizes.Normal
            )

            MinimalistButton(
                text = "ALLOW LOCATION"
            ) { onEnableLocationClick() }

        } else {
            Text(
                text = "Menus around you",
                color = Colors.BLACK,
                fontFamily = Global.Fonts.Bold,
                fontSize = Global.FontSizes.Subtitle,
                modifier = Modifier.padding(bottom = 10.dp)
            )
        }
    }

}
