import { View, ScrollView, Text, Button, StyleSheet, Dimensions } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useNavigation } from '@react-navigation/native';
import { globalStyles, imageBase64 } from '../../styles/global';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import MyLogo from '../common/icons/MyLogo';
import MenuPreview from '../common/other/MenuPreview';
import ProgressBar from '../common/other/ProgressBar';
import InfoTextBox from '../common/other/InfoTextBox';
import PositionViewModel from '../../viewmodel/PositionViewModel';

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

    const orderInformation = {
        userLocation: {
            latitude: 45.476770,
            longitude: 9.232131,
        },
        droneLocation: {
            latitude: 45.486911,
            longitude: 9.232021,
        },
        deliveryLocation: {
            latitude: 45.477211,
            longitude: 9.242321,
        }
    }

    const deltasForDrone = PositionViewModel.calculateMapDeltas(orderInformation.userLocation, orderInformation.droneLocation);
    const deltasForDeliveryPlace = PositionViewModel.calculateMapDeltas(orderInformation.userLocation, orderInformation.deliveryLocation);

    const latitudeDelta = Math.max(deltasForDeliveryPlace.latitudeDelta, deltasForDrone.latitudeDelta).toFixed(6);
    const longitudeDelta = Math.max(deltasForDeliveryPlace.longitudeDelta, deltasForDrone.longitudeDelta).toFixed(6);

    console.log(orderInformation.userLocation, latitudeDelta, longitudeDelta);

    let price = menuInformation.price.toFixed(2);
    let timeAtDelivery = "10:15";

    const navigation = useNavigation();

    console.log("OK");

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
                            latitude: orderInformation.userLocation.latitude, // Centered on my location
                            longitude: orderInformation.userLocation.longitude,
                            latitudeDelta: parseFloat(latitudeDelta),
                            longitudeDelta: parseFloat(longitudeDelta),
                        }}
                    >
                        <Marker
                            coordinate={{
                                latitude: parseFloat(orderInformation.deliveryLocation.latitude),
                                longitude: parseFloat(orderInformation.deliveryLocation.longitude),
                            }}
                            title="Delivery Place"
                            description="The Location where the drone will deliver the order"
                            onPress={() => console.log("Hello Marker")}
                        />

                        <Marker
                            coordinate={orderInformation.droneLocation}
                            title="Drone Location"
                            description="The current location of the drone"
                            onPress={() => console.log("Hello Marker")}
                        />

                        <Marker
                            coordinate={orderInformation.userLocation}
                            title="User Location"
                            description="Your Location"
                            onPress={() => console.log("Hello Marker")}
                        />

                    </MapView>
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

                    <View style={[globalStyles.insetContainer, { marginTop: 20 }]}>
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