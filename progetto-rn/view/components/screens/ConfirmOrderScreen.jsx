import { ScrollView, View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { globalStyles, imageBase64 } from '../../../styles/global';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import MyIcon, { IconNames } from '../common/icons/MyIcon';
import Separator from '../common/other/Separator';
import InfoTextBox from '../common/other/InfoTextBox';
import LargeButton from '../common/buttons/LargeButton';


const { height } = Dimensions.get('window');

export default ConfirmOrderScreen = ({ menuInformation }) => {

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

                        <View style={{ flexDirection: 'row', marginHorizontal: 15, marginVertical: 25, }}>
                            <TouchableOpacity onPress={() => navigation.goBack()} >
                                <MyIcon name={IconNames.ARROW_LEFT} size={32} color={colors.black} />
                            </TouchableOpacity>
                            <Text style={[globalStyles.textBlack, globalStyles.textTitleRegular, { flex: 1, textAlign: 'center', marginEnd: 20 }]}>
                                Your order
                            </Text>
                        </View>

                        <InfoTextBox
                            iconName={IconNames.MARKER}
                            label={"Menu Location"}
                            text={"San Francisco Bay Area"}
                        />
                        <Separator size={1} color={colors.lightGray} />
                        <InfoTextBox
                            iconName={IconNames.HOME}
                            label={"Your Location"}
                            text={"San Francisco Bay Area"}
                        />
                        <Separator size={10} color={colors.lightGray} />
                        <View style={[globalStyles.flexBetween, globalStyles.insetContainer, { marginVertical: 20 }]}>
                            <Text style={[globalStyles.textBlack, globalStyles.textNormalMedium]}>
                                Delivery Time
                            </Text>
                            <Text style={[globalStyles.textBlack, globalStyles.textNormalMedium]}>
                                {menuInformation.deliveryTime} min(s)
                            </Text>
                        </View>
                        <Separator size={10} color={colors.lightGray} />

                        <View style={[globalStyles.flexBetween, { gap: 20, marginHorizontal: 30, marginVertical: 20 }]}>
                            <View style={styles.imageContainer}>
                                {image && <Image source={{ uri: image }} style={styles.image} />}
                                {!image && <View style={styles.iconContainer}>
                                    <MyIcon name={IconNames.FOOD} size={100} color={colors.gray} />
                                </View>}
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={[globalStyles.textBlack, globalStyles.textSubtitleMedium]}>{menuInformation.title}</Text>
                                <Text style={[globalStyles.textDarkGray, globalStyles.textNormalRegular]}>{"€" + price}</Text>
                            </View>
                        </View>
                        <Separator size={1} color={colors.lightGray} />
                        <View style={[globalStyles.flexBetween, globalStyles.insetContainer, { marginVertical: 20 }]}>
                            <Text style={[globalStyles.textBlack, globalStyles.textNormalMedium]}>
                                Total
                            </Text>
                            <Text style={[globalStyles.textBlack, globalStyles.textNormalMedium]}>
                                {"€" + price}
                            </Text>
                        </View>
                        <Separator size={1} color={colors.lightGray} />

                        <View style={[globalStyles.insetContainer, { marginTop: 20 }]}>
                            <Text style={[globalStyles.textBlack, globalStyles.textNormalMedium]}>
                                Payment Method
                            </Text>
                            <View style={[globalStyles.flexBetween, { gap: 20, margin: 20, }]}>
                                <View>
                                    <MyIcon name={IconNames.CREDIT_CARD} size={32} color={colors.gray} />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={[globalStyles.textDarkGray, globalStyles.textNormalRegular]}>
                                        JOHN DOE's Credit Card {'\n'}
                                        **** **** **** 1234
                                    </Text>
                                </View>
                            </View>
                        </View>


                    </View>

                    <View style={[globalStyles.insetContainer, { marginTop: 25, marginBottom: 5 }]}>
                        <Text style={[globalStyles.textBlack, globalStyles.textSmallRegular, {marginVertical: 15,}]}>
                            If you’re not around when the courier arrives, they’ll leave
                            your order at the door. By placing your order, you agree
                            to take full responsibilty for it once it’s delivered.
                        </Text>
                        <LargeButton text="Confirm and Pay" onPress={() => console.log("Pressed")} />
                    </View>

                </ScrollView>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({

    imageContainer: {
        width: 50,
        height: 50,
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
        left: 15,
        top: 15,
    },

    image: {
        width: '100%',
        height: '100%',
    }

});