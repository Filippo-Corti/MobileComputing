import { ScrollView, View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { globalStyles, imageBase64 } from '../../styles/global';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import MyIcon, { IconNames } from '../common/icons/MyIcon';
import Separator from '../common/other/Separator';
import InfoTextBox from '../common/other/InfoTextBox';
import LargeButton from '../common/buttons/LargeButton';


const { height } = Dimensions.get('window');

export default MenuDetailsScreen = ({ menuInformation }) => {

    menuInformation = {
        title: 'McMushroom Pizza',
        price: 17,
        description: 'Garlic, olive oil base, mozarella, cremini mushrooms, ricotta, thyme, white truffle oil. Add arugula for an extra charge lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        deliveryTime: 30,
        distanceFromYou: 0.2,
        image: imageBase64,
    }

    let image = menuInformation.image;
    if (image) {
        if (!image.startsWith("data:image/jpeg;base64,")) {
            image = "data:image/jpeg;base64," + image;
        }
    }

    let price = menuInformation.price.toFixed(2);


    const navigation = useNavigation();

    return (
        <SafeAreaProvider>
            <SafeAreaView style={[globalStyles.container, { flex: 1 }]}>
                <ScrollView contentContainerStyle={{ flexGrow: 1 }}>

                    <View style={{ flex: 1 }}>
                        <View style={styles.imageContainer}>
                            {image && <Image source={{ uri: image }} style={styles.image} />}
                            {!image && <View style={styles.iconContainer}>
                                <MyIcon name={IconNames.FOOD} size={100} color={colors.gray} />
                            </View>}
                            <TouchableOpacity style={[styles.backArrowContainer, { borderWidth: (!image) ? 1 : 0 }]} onPress={() => navigation.goBack()}>
                                <MyIcon name={IconNames.ARROW_LEFT} size={32} color={colors.black} />
                            </TouchableOpacity>
                        </View>

                        <View style={[globalStyles.insetContainer, { marginVertical: 20 }]}>
                            <Text style={[globalStyles.textBlack, globalStyles.textTitleBold, {marginTop: 5, marginBottom: 10,}]}>
                                {menuInformation.title}
                            </Text>

                            <View style={{ flexDirection: 'row', justifyContent: 'flex-start', gap: 5, marginBottom: 10 }}>
                                <MyIcon name={IconNames.PRICE_TAG} size={22} color={colors.primary} />
                                <Text style={[globalStyles.textDarkGray, globalStyles.textSubtitleMedium]}>
                                    €{price}
                                </Text>
                            </View>

                            <Text style={[globalStyles.textBlack, globalStyles.textNormalRegular, {marginTop: 10,}]}>
                                {menuInformation.description}
                            </Text>
                        </View>

                        <Separator size={10} color={colors.lightGray} />
                        <InfoTextBox
                            iconName={IconNames.MARKER}
                            label={"Menu Location"}
                            text={"San Francisco Bay Area"}
                        />
                        <Separator size={10} color={colors.lightGray} />
                        <InfoTextBox
                            iconName={IconNames.CLOCK}
                            text={"Approximately " + menuInformation.deliveryTime + " min(s)"}
                        />
                        <Separator size={1} color={colors.lightGray} />
                    </View>

                    <View style={[globalStyles.insetContainer, { marginTop: 25, marginBottom: 5 }]}>
                        <LargeButton text={"Order • €" + price} onPress={() => navigation.navigate("ConfirmOrder")} />
                    </View>

                </ScrollView>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({

    imageContainer: {
        width: '100%',
        height: height * 0.25,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },

    iconContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },

    backArrowContainer: {
        padding: 10,
        backgroundColor: colors.white,
        borderRadius: '50%',
        position: 'absolute',
        left: 10,
        top: 10,
    },

    image: {
        width: '100%',
        height: '100%',
    }

});