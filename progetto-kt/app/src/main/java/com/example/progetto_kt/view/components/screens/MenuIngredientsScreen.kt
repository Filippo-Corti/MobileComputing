package com.example.progetto_kt.view.components.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.lazy.itemsIndexed
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.example.progetto_kt.model.dataclasses.Ingredient
import com.example.progetto_kt.view.components.common.icons.IconNames
import com.example.progetto_kt.view.components.common.icons.MyIcon
import com.example.progetto_kt.view.components.common.other.IngredientItem
import com.example.progetto_kt.view.components.common.other.MyDialog
import com.example.progetto_kt.view.styles.Colors
import com.example.progetto_kt.view.styles.Global
import com.example.progetto_kt.viewmodel.MainViewModel


@Composable
fun MenuIngredientsScreen(
    viewModel: MainViewModel,
    menuId: Int,
    onBackClick: () -> Unit
) {

    val TAG = "MenuIngredients"

    val appState by viewModel.appState.collectAsState()
    val menusState by viewModel.menusExplorationState.collectAsState()
    var showDialog by remember { mutableStateOf(false) }
    var selectedIngredient by remember { mutableStateOf<Ingredient?>(null) }

    val menu = menusState.selectedMenu

    LaunchedEffect(menuId) {
        if (menu == null)
            viewModel.fetchMenuDetails(menuId)

        viewModel.fetchMenuIngredients(menuId)
    }

    if (appState.isLoading || menu == null) {
        return Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
            CircularProgressIndicator(color = Colors.PRIMARY)
        }
    }

    val menuDetails = menusState.selectedMenu?.menuDetails
    val ingredients = menusState.selectedMenuIngredients

    Box(
        modifier = Global.Container
            .fillMaxSize()
    ) {
        LazyColumn(
            modifier = Modifier
                .fillMaxHeight()
        ) {

            item {
                Box(
                    modifier = Modifier
                        .fillMaxWidth(),
                    contentAlignment = Alignment.Center
                ) {

                    Text(
                        text = "${menuDetails?.name}'s Ingredients",
                        color = Colors.BLACK,
                        fontSize = Global.FontSizes.Title,
                        fontFamily = Global.Fonts.Regular,
                        modifier = Modifier.padding(vertical = 3.dp)
                    )

                    Row(
                        modifier = Modifier
                            .size(60.dp)
                            .align(Alignment.CenterStart)
                            .clickable { onBackClick() },
                        horizontalArrangement = Arrangement.Center,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Box(
                            modifier = Modifier
                                .background(Colors.WHITE, shape = CircleShape)
                                .padding(5.dp)
                        ) {
                            MyIcon(
                                name = IconNames.ARROW_LEFT,
                                size = 32,
                                color = Colors.BLACK
                            )
                        }
                    }
                }
            }

            if (ingredients.isEmpty()) {
                item {
                    Text(
                        text = "No ingredients found for this menu, sorry",
                        color = Colors.BLACK,
                        fontSize = Global.FontSizes.Normal,
                        fontFamily = Global.Fonts.Regular,
                        modifier = Modifier.padding(horizontal = 5.dp)
                    )
                }
            } else {

                itemsIndexed(ingredients) { idx, ingredient ->

                    IngredientItem(
                        prefix = "${idx+1}.",
                        ingredient = ingredient
                    ) {
                        selectedIngredient = ingredient
                        showDialog = true
                    }

                }

            }

        }
    }

    if (showDialog && selectedIngredient != null ) {
        MyDialog(
            title = "Description:",
            content = selectedIngredient!!.description
        ) {
            showDialog = false
        }
    }
}
