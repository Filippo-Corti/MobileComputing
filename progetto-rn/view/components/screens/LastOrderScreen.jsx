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
import { useContext, useEffect, useState, useRef } from 'react';
import ButtonWithArrow from '../common/buttons/ButtonWithArrow';
import ViewModel from '../../../viewmodel/ViewModel';
import * as Location from 'expo-location';
import MenuSmallPreview from '../common/other/MenuSmallPreview';
import { useIsFocused } from '@react-navigation/native';


const { height } = Dimensions.get('window');

export default LastOrderScreen = ({ }) => {

    const viewModel = ViewModel.getViewModel()

    const userLocation = {
        longitude: 9.232131,
        latitude: 45.476770,
    }

    const navigation = useNavigation();

    const [deliveryAddress, setDeliveryAddress] = useState(null);
    const [droneAddress, setDroneAddress] = useState(null);
    const { userData, orderData, setOrderData } = useContext(UserContext);

    const fetchLastOrder = async () => {
        console.log("Executing Fetch")
        try {
            const orderDetails = await viewModel.getOrderAndMenuDetails(orderData.id);
            setOrderData(orderDetails);
            //console.log("Fetched Order Data:", orderDetails.deliveryLocation);
        } catch (err) {
            console.error("Error fetching the last order details:", err);
        }
    }

    const fetchDeliveryAddress = async () => {
        try {
            //console.log("Fetching delivery address, with orderData", orderData, orderData.deliveryLocation)
            const delAddressString = await PositionViewModel.getAddressFromCoordinates(orderData.deliveryLocation)
            setDeliveryAddress(delAddressString)
            //console.log("Fetched Order Address via Reverse Geocoding:", delAddressString);
        } catch (err) {
            console.log("Error fetching the last order address:", err, orderData.menuId);
            setDeliveryAddress("(" + orderData.deliveryLocation.latitude + ", " + orderData.deliveryLocation.longitude + ")");
        }
    }

    const fetchDroneAddress = async () => {
        try {
            //console.log("Fetching drone address, with orderData", orderData != null)
            const droneAddressString = await PositionViewModel.getAddressFromCoordinates(orderData.currentLocation)
            setDroneAddress(droneAddressString)
            //console.log("Fetched Drone Address via Reverse Geocoding:", droneAddressString);
        } catch (err) {
            console.log("Error fetching the drone address:", err);
            setDroneAddress("(" + orderData.currentLocation.latitude + ", " + orderData.currentLocation.longitude + ")");
        }
    }

    const fetchData = async () => {
        if (orderData && orderData.id)
            await fetchLastOrder();

        if (orderData.deliveryLocation)
            await fetchDeliveryAddress();

        if (orderData.currentLocation)
            await fetchDroneAddress();
    };


    // Auto - Reload every 5 seconds
    const isFocused = useIsFocused(); // Tracks if the screen is currently focused
    const intervalId = useRef(null);

    useEffect(() => {
        if (isFocused) {
            console.log("Screen is focused, starting timer");
            intervalId.current = setInterval(fetchData, 5000);
        } else {
            console.log("Screen is not focused, stopping timer");
            if (intervalId.current) {
                clearInterval(intervalId.current);
                intervalId.current = null;
            }
        }

        // Cleanup function to stop the timer when the component unmounts
        return () => {
            if (intervalId.current) {
                clearInterval(intervalId.current);
                intervalId.current = null;
            }
        };
    }, [isFocused]);

    useEffect(() => {
        const initializeAndFetch = async () => {
            if (orderData && orderData.id && !orderData.orderDetailsRetrieved)
                await fetchLastOrder();

            if (orderData.deliveryLocation)
                await fetchDeliveryAddress();

            if (orderData.currentLocation)
                await fetchDroneAddress();
        };

        initializeAndFetch();
    }, [orderData]);


    const showOrder = (viewModel && orderData && orderData.id && orderData.orderDetailsRetrieved);
    const deltas = (showOrder)
        ? PositionViewModel.calculateMapDeltas2Positions(userLocation, orderData.deliveryLocation, orderData.currentLocation)
        : null;

    const timeInfo = (showOrder) ? viewModel.extractFormattedOrderInformation(orderData) : null

    // console.log("User Data is ", userData);
    // console.log("Order Data is ", orderData);
    // console.log("Showing order:", showOrder)
    // console.log("Address is", deliveryAddress);
    console.log("Time Info is", timeInfo)

    return (
        <SafeAreaView style={globalStyles.container}>
            <ScrollView>

                {(showOrder)
                    ? <ShowOrderState orderData={orderData} deliveryAddress={deliveryAddress} droneAddress={droneAddress} timeInfo={timeInfo} deltas={deltas} />
                    : <NoOrderState navigation={navigation} />
                }
                <StatusBar style="auto" />
            </ScrollView>
        </SafeAreaView>
    );
}

const Header = ({timeInfo}) => (
    <View style={[globalStyles.insetContainer, globalStyles.flexBetween, { marginHorizontal: 10, marginVertical: 22 }]}>
        <View style={{ flex: 1 }}>
            <Text style={[globalStyles.textBlack, globalStyles.textTitleMedium]}>
                {timeInfo.statusText}
            </Text>
            {
                <>
                    <Text style={[globalStyles.textBlack, globalStyles.textNormalRegular, { marginVertical: 10 }]}>
                        <Text style={[globalStyles.textNormalMedium]}>{timeInfo.deliveryText}</Text> ({timeInfo.minutesText})
                    </Text>
                    <ProgressBar progress={timeInfo.progress} />
                </>
            }
        </View>
    </View>
)

const NoOrderState = ({ navigation }) => (
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
)

const ShowOrderState = ({ orderData, deliveryAddress, droneAddress, timeInfo, deltas }) => (
    <>

        <Header timeInfo={timeInfo} />

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
            <View style={{ marginVertical: 5 }}>
                <Text style={[globalStyles.textDarkGray, globalStyles.textSmallRegular, { marginTop: 15 }]}>
                    Pick it up at
                </Text>
                <Text style={[globalStyles.textBlack, globalStyles.textNormalRegular]}>
                    {deliveryAddress}
                </Text>
            </View>
            <View style={{ marginVertical: 5 }}>
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
)

const styles = StyleSheet.create({

    map: {
        width: '100%',
        height: height * 0.20,
    },

});