import { View, ScrollView, Text, Button, StyleSheet, Dimensions } from 'react-native';
import MapView from 'react-native-maps';
import { useNavigation } from '@react-navigation/native';
import { globalStyles, imageBase64 } from '../../styles/global';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import MyLogo from '../common/icons/MyLogo';
import MenuPreview from '../common/other/MenuPreview';
import ProgressBar from '../common/other/ProgressBar';
import InfoTextBox from '../common/other/InfoTextBox';

const { height } = Dimensions.get('window');

export default LastOrderScreen = ({ }) => {

    const menuInformation = {
        title: 'McMushroom Pizza',
        price: 17,
        description: 'Garlic, olive oil base, mozarella, cremini mushrooms, ricotta, thyme, white truffle oil. Add arugula for an extra charge lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        deliveryTime: 30,
        distanceFromYou: 0.2,
        image: imageBase64,
    }

    let price = menuInformation.price.toFixed(2);
    let timeAtDelivery = "10:15";

    const navigation = useNavigation();

    return (
        <SafeAreaProvider>
            <SafeAreaView style={globalStyles.container}>
                <ScrollView>

                    <View style={[globalStyles.insetContainer, globalStyles.flexBetween, { marginHorizontal: 10, marginVertical: 22 }]}>
                        <View style={{ flex: 1 }}>
                            <Text style={[globalStyles.textBlack, globalStyles.textTitleMedium]}>
                                Almost there...
                            </Text>
                            <Text style={[globalStyles.textBlack, globalStyles.textNormalRegular, { marginVertical: 10 }]}>
                                Arriving at <Text style={[globalStyles.textNormalMedium]}>{timeAtDelivery}</Text> ({menuInformation.deliveryTime} minutes away)
                            </Text>
                            <ProgressBar progress={80} />
                        </View>
                    </View>
                    <MapView
                        style={styles.map}
                        initialRegion={{
                            latitude: 45.476770,
                            longitude: 9.232131,
                            latitudeDelta: 0.01,
                            longitudeDelta: 0.01,
                        }}
                    />
                    <View style={[globalStyles.insetContainer, { paddingVertical: 25 }]}>
                        <Text style={[globalStyles.textBlack, globalStyles.textSubtitleMedium]}>
                            Delivery details
                        </Text>
                        <Text style={[globalStyles.textDarkGray, globalStyles.textSmallRegular, { marginTop: 15 }]}>
                            Pick it up at
                        </Text>
                        <Text style={[globalStyles.textBlack, globalStyles.textNormalRegular]}>
                            Bay Area, San Francisco, California, USA
                        </Text>
                    </View>
                    <Separator size={10} color={colors.lightGray} />

                    <View style={[globalStyles.insetContainer, {marginTop: 20}]}>
                        <Text style={[globalStyles.textBlack, globalStyles.textSubtitleMedium]}>
                            Order details
                        </Text>
                    </View>
                    <View style={[globalStyles.flexBetween, globalStyles.insetContainer, { marginBottom: 20, marginTop: 10 }]}>
                        <Text style={[globalStyles.textBlack, globalStyles.textNormalMedium]}>
                           1x {menuInformation.title}
                        </Text>
                        <Text style={[globalStyles.textBlack, globalStyles.textNormalMedium]}>
                            €{price}
                        </Text>
                    </View>

                    <StatusBar style="auto" />
                </ScrollView>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({

    map: {
        width: '100%',
        height: height * 0.20,
    },

});