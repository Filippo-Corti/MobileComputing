import { View, ScrollView, Text, Button, StyleSheet, Dimensions } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useNavigation } from '@react-navigation/native';
import { globalStyles, imageBase64 } from '../../../styles/global';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import MyLogo from '../common/icons/MyLogo';
import MenuPreview from '../common/other/MenuPreview';
import ProgressBar from '../common/other/ProgressBar';
import InfoTextBox from '../common/other/InfoTextBox';
import PositionViewModel from '../../../viewmodel/PositionViewModel';
import { UserContext } from '../../context/UserContext';
import { useContext, useEffect } from 'react';
import ButtonWithArrow from '../common/buttons/ButtonWithArrow';
import ViewModel from '../../../viewmodel/ViewModel';


const { height } = Dimensions.get('window');

export default LastOrderScreen = ({ }) => {

    const viewModel = ViewModel.getViewModel();

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
            longitude: 9.232131,
            latitude: 45.476770,
        },
        droneLocation: {
            longitude: 9.232021,
            latitude: 45.486911,
        },
        deliveryLocation: {
            longitude: 9.242321,
            latitude: 45.477211,
        }
    }

    const deltasForDrone = PositionViewModel.calculateMapDeltas(orderInformation.userLocation, orderInformation.droneLocation);
    const deltasForDeliveryPlace = PositionViewModel.calculateMapDeltas(orderInformation.userLocation, orderInformation.deliveryLocation);

    const latitudeDelta = parseFloat(Math.max(deltasForDeliveryPlace.latitudeDelta, deltasForDrone.latitudeDelta).toFixed(6));
    const longitudeDelta = parseFloat(Math.max(deltasForDeliveryPlace.longitudeDelta, deltasForDrone.longitudeDelta).toFixed(6));

    console.log(orderInformation.userLocation, latitudeDelta, longitudeDelta);

    let price = menuInformation.price.toFixed(2);
    let timeAtDelivery = "10:15";

    const { userData, orderData, setOrderData } = useContext(UserContext);
    const showOrder = (orderData?.oid && orderData.orderDetailsRetrieved);

    console.log("User Data is", userData);
    console.log("Order data is", orderData);

    const navigation = useNavigation();

    // Fetch order details if necessary
    useEffect(() => {
        const fetchOrderDetails = async () => {
            if (orderData?.oid && !orderData.orderDetailsRetrieved) { // If there is an order but we don't have the details
                try {
                    const orderDetails = await viewModel.getOrderDetails(orderData.oid);
                    if (orderDetails) setOrderData(orderDetails);
                } catch (error) {
                    console.error("Error fetching order details:", error);
                }
            }
        };

        fetchOrderDetails();
    }, [orderData, viewModel, setOrderData]);

    const arrivalTimeInfo = orderData?.extractArrivalTimeInformation();

    return (
        <SafeAreaProvider>
            <SafeAreaView style={globalStyles.container}>
                <ScrollView>

                    <View style={[globalStyles.insetContainer, globalStyles.flexBetween, { marginHorizontal: 10, marginVertical: 22 }]}>
                        <View style={{ flex: 1 }}>
                            <Text style={[globalStyles.textBlack, globalStyles.textTitleMedium]}>
                                {(showOrder) ? "Almost there..." : "No orders yet..."}
                            </Text>
                            {showOrder &&
                                <>
                                    <Text style={[globalStyles.textBlack, globalStyles.textNormalRegular, { marginVertical: 10 }]}>
                                        Arriving at <Text style={[globalStyles.textNormalMedium]}>{arrivalTimeInfo.formattedTime}</Text> ({arrivalTimeInfo.minutesAway} minutes away)
                                    </Text>
                                    <ProgressBar progress={80} />
                                </>
                            }
                        </View>
                    </View>
                    {(showOrder)
                        ? <>
                            <MapView
                                style={styles.map}
                                provider="google"
                                showsCompass={true}
                                showsPointsOfInterest={false}
                                loadingEnabled={true}
                                initialRegion={{
                                    longitude: orderInformation.userLocation.longitude,
                                    latitude: orderInformation.userLocation.latitude,
                                    latitudeDelta: latitudeDelta,
                                    longitudeDelta: longitudeDelta,
                                }}
                            >
                                <Marker
                                    coordinate={orderInformation.deliveryLocation}
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
                        </>
                        : <>
                            <View style={[globalStyles.insetContainer, { marginTop: 20, marginHorizontal: 5 }]}>
                                <Text style={[globalStyles.textBlack, globalStyles.textNormalRegular]}>
                                    This is where your order will appear after you placed it. {'\n'}
                                    You’ll be able to check how far it is from you and how long it will take the drone to deliver it. {'\n'}
                                    {'\n'}
                                    Right now you haven’t placed your first order yet. Go check some menus in the home page!
                                </Text>
                                <View style={{ alignSelf: 'flex-end', marginTop: 20 }}>
                                    <ButtonWithArrow text="Explore menus" onPress={() => navigation.navigate("HomeStack")} />
                                </View>
                            </View>
                        </>
                    }
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