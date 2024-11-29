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
import { useContext, useEffect, useState } from 'react';
import ButtonWithArrow from '../common/buttons/ButtonWithArrow';
import ViewModel from '../../../viewmodel/ViewModel';
import * as Location from 'expo-location';
import MenuSmallPreview from '../common/other/MenuSmallPreview';


const { height } = Dimensions.get('window');

export default LastOrderScreen = ({ }) => {

    const userLocation = {
        longitude: 9.232131,
        latitude: 45.476770,
    }

    const navigation = useNavigation();

    const [viewModel, setViewModel] = useState(null);
    const [deliveryAddress, setDeliveryAddress] = useState(null);
    const [droneAddress, setDroneAddress] = useState(null);
    const { userData, orderData, setOrderData } = useContext(UserContext);

    const initViewModel = async () => {
        try {
            const newViewModel = ViewModel.getViewModel();
            setViewModel(newViewModel);
        } catch (err) {
            console.error("Error loading the View Model:", err);
        }
    }

    const fetchLastOrder = async () => {
        try {
            const orderDetails = await viewModel.getOrderAndMenuDetails(orderData.id);
            setOrderData(orderDetails);
            console.log("Fetched Order Data:", orderDetails.deliveryLocation);
        } catch (err) {
            console.error("Error fetching the last order details:", err);
        }
    }

    const fetchDeliveryAddress = async () => {
        try {
            const delAddressString = await PositionViewModel.getAddressFromCoordinates(orderData.deliveryLocation)
            setDeliveryAddress(delAddressString)
            console.log("Fetched Order Address via Reverse Geocoding:", delAddressString);
        } catch (err) {
            console.error("Error fetching the last order address:", err);
            setDeliveryAddress("(" + orderData.deliveryLocation.latitude + ", " + orderData.deliveryLocation.longitude + ")");
        }
    }

    const fetchDroneAddress = async () => {
        try {
            console.log("Fetching drone address, with orderData", orderData)
            const droneAddressString = await PositionViewModel.getAddressFromCoordinates(orderData.currentLocation)
            setDroneAddress(droneAddressString)
            console.log("Fetched Drone Address via Reverse Geocoding:", droneAddressString);
        } catch (err) {
            console.error("Error fetching the drone address:", err);
            setDeliveryAddress("(" + orderData.currentLocation.latitude + ", " + orderData.currentLocation.longitude + ")");
        }
    }

    useEffect(() => {
        const initializeAndFetch = async () => {
            if (!viewModel)
                await initViewModel();

            if (viewModel) {
                if (orderData && orderData.id && !orderData.orderDetailsRetrieved)
                    await fetchLastOrder();

                if (orderData && orderData.deliveryLocation)
                    await fetchDeliveryAddress();

                if (orderData && orderData.currentLocation)
                    await fetchDroneAddress();
            }
        };

        initializeAndFetch();
    }, [orderData, viewModel]);

    const arrivalTimeInfo = orderData?.extractArrivalTimeInformation();

    const showOrder = (orderData && orderData.id && orderData.orderDetailsRetrieved);
    const deltas = (showOrder)
        ? PositionViewModel.calculateMapDeltas2Positions(userLocation, orderData.deliveryLocation, orderData.currentLocation)
        : null;

    console.log("User Data is ", userData);
    //console.log("Order Data is ", orderData);
    console.log("ArrivalTimeInfo is", arrivalTimeInfo);
    console.log("Showing order:", showOrder)
    console.log("Address is", deliveryAddress);

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
                                        Arriving at <Text style={[globalStyles.textNormalMedium]}>{arrivalTimeInfo?.formattedTime}</Text> ({arrivalTimeInfo?.minutesAway} minutes away)
                                    </Text>
                                    <ProgressBar progress={70} />
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
                                showsUserLocation={true}
                                followsUserLocation={true}
                                loadingEnabled={true}
                                initialRegion={{
                                    ...orderData.deliveryLocation,
                                    ...deltas
                                }}
                            >
                                <Marker
                                    coordinate={orderData.deliveryLocation}
                                    title="Delivery Place"
                                    description="The Location where the drone will deliver the order"
                                    onPress={() => console.log("Hello Marker")}
                                />

                                <Marker
                                    coordinate={orderData.currentLocation}
                                    title="Drone Location"
                                    description="The current location of the drone"
                                    onPress={() => console.log("Hello Marker")}
                                />

                            </MapView>
                            <View style={[globalStyles.insetContainer, { paddingVertical: 25 }]}>
                                <Text style={[globalStyles.textBlack, globalStyles.textSubtitleMedium]}>
                                    Delivery details
                                </Text>
                                <View style={{marginVertical: 5}}>
                                    <Text style={[globalStyles.textDarkGray, globalStyles.textSmallRegular, { marginTop: 15 }]}>
                                        Pick it up at
                                    </Text>
                                    <Text style={[globalStyles.textBlack, globalStyles.textNormalRegular]}>
                                        {deliveryAddress}
                                    </Text>
                                </View>
                                <View style={{marginVertical: 5}}>
                                    <Text style={[globalStyles.textDarkGray, globalStyles.textSmallRegular, { marginTop: 15 }]}>
                                        Drone is currently at
                                    </Text>
                                    <Text style={[globalStyles.textBlack, globalStyles.textNormalRegular]}>
                                        {droneAddress}
                                    </Text>
                                </View>
                            </View>
                            <Separator size={10} color={colors.lightGray} />

                            <View style={[globalStyles.insetContainer, { marginTop: 20 }]}>
                                <Text style={[globalStyles.textBlack, globalStyles.textSubtitleMedium]}>
                                    Order details
                                </Text>
                            </View>
                            <MenuSmallPreview
                                image={orderData.menu.image}
                                title={"1x " + orderData.menu.name}
                                price={orderData.menu.formatPrice()}
                            />
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