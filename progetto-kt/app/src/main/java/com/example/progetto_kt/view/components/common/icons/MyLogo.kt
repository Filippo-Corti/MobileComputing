import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.offset
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import com.example.progetto_kt.view.styles.Colors
import com.example.progetto_kt.view.styles.Global

@Composable
fun MyLogo() {
    Column {
        Text(
            text = "Mangia",
            style = TextStyle(
                fontSize = Global.FontSizes.Title,
                color = Colors.BLACK,
                lineHeight = Global.FontSizes.Title,
                fontFamily = Global.Fonts.Logo
            )
        )
        Text(
            text = "e Basta",
            style = TextStyle(
                fontSize = Global.FontSizes.Title,
                color = Colors.PRIMARY,
                lineHeight = Global.FontSizes.Title,
                fontFamily = Global.Fonts.Logo
            ),
            modifier = Modifier.offset(x = 8.dp, y = (-4).dp)
        )
    }
}

@Preview
@Composable
fun MyLogoPreview() {
    MyLogo()
}