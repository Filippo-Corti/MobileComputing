import { View, ScrollView, Text, StyleSheet, Dimensions, ActivityIndicator, Image } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useNavigation } from '@react-navigation/native';
import { globalStyles } from '../../../styles/global';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import ProgressBar from '../common/other/ProgressBar';
import { UserContext } from '../../context/UserContext';
import { useContext, useEffect, useRef, useState } from 'react';
import ButtonWithArrow from '../common/buttons/ButtonWithArrow';
import ViewModel from '../../../viewmodel/ViewModel';
import MenuSmallPreview from '../common/other/MenuSmallPreview';
import { useIsFocused } from '@react-navigation/native';
import React from 'react';
import Separator from '../common/other/Separator';
import colors from '../../../styles/colors';
import { AppStateContext } from '../../context/AppStateContext';
import MyLogo from '../common/icons/MyLogo';
import SplashScreen from '../common/other/SplashScreen';
import { set } from 'react-hook-form';
import MyIcon, { IconNames } from '../common/icons/MyIcon';

const { height } = Dimensions.get('window');

/**
 * @returns {JSX.Element} 
 */
const LastOrderScreen = ({ }) => {

    const navigation = useNavigation();

    const { userState, orderState, setOrderState } = useContext(UserContext);
    const { appState, locationState, setError } = useContext(AppStateContext);
    const [isFetching, setIsFetching] = useState(false);

    const fetchLastOrder = async () => {
        if (!userState.user?.lastOid) {
            setIsFetching(false);
            return;
        }
        try {
            const order = await ViewModel.fetchOrderDetails(userState.user.lastOid);
            const orderedMenu = await ViewModel.fetchMenuDetails(
                locationState.lastKnownLocation.lat,
                locationState.lastKnownLocation.lng,
                order.mid
            );
            setOrderState({
                lastOrder: order,
                lastOrderMenu: orderedMenu,
            });
        } catch (err) {
            setError(err);
        } finally {
            setIsFetching(false);
        }
    }

    // Auto - Reload every 5 seconds
    const isFocused = useIsFocused(); // Tracks if the screen is currently focused
    const intervalId = useRef(null);

    useEffect(() => {
        if (isFocused) {
            console.log("Screen is focused, starting timer");
            setIsFetching(true);
            fetchLastOrder();
            intervalId.current = setInterval(fetchLastOrder, 5000);
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

    if (appState.isLoading || isFetching) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    if (!userState.isUserRegistered || !userState.user || !userState.user.lastOid || !orderState.lastOrder || !orderState.lastOrderMenu) {
        return (
            <SafeAreaView style={globalStyles.container}>
                <ScrollView>
                    <NoOrderState
                        // @ts-ignore
                        onPress={() => navigation.navigate("HomeStack")}
                    />
                </ScrollView>
            </SafeAreaView>
        );

    }

    return (
        <SafeAreaView style={globalStyles.container}>
            <ScrollView>

                <ShowOrderState
                    orderData={orderState.lastOrder}
                    menuData={orderState.lastOrderMenu}
                    locationData={locationState}
                />

                <StatusBar style="auto" />
            </ScrollView>
        </SafeAreaView>
    );
}

const Header = ({
    orderData
}) => {

    const now = new Date().getTime()
    const creationTime = new Date(orderData.creationTimestamp).getTime()
    const expectedDeliveryTime = new Date(orderData.expectedDeliveryTimestamp).getTime()
    const deliveryTime = new Date(orderData.deliveryTimestamp).getTime()
    const completed = (orderData.status === "COMPLETED")
    const totalTime = expectedDeliveryTime - creationTime
    const elapsedTime = now - creationTime

    const progress = (completed) ? 100 : (elapsedTime / totalTime) * 100
    const minutesAway = Math.floor((((completed) ? deliveryTime : expectedDeliveryTime) - now) / 60000)


    return (
        <View style={[globalStyles.insetContainer, globalStyles.flexBetween, { marginHorizontal: 10, marginVertical: 22 }]}>
            <View style={{ flex: 1 }}>
                <Text style={[globalStyles.textBlack, globalStyles.textTitleMedium]}>
                    {(completed) ? "Your order has arrived!" : "Almost there..."}
                </Text>
                {
                    <>
                        <Text style={[globalStyles.textBlack, globalStyles.textNormalRegular, { marginVertical: 10 }]}>
                            <Text style={[globalStyles.textNormalMedium]}>
                                {(completed)
                                    ? "Arrived at " + new Date(deliveryTime).toLocaleTimeString()
                                    : "Arriving at " + new Date(expectedDeliveryTime).toLocaleTimeString()
                                }
                            </Text>
                            {(completed)
                                ? "  (" + (- minutesAway) + " minutes ago)"
                                : "  (" + (minutesAway + 1) + " minutes away)"
                            }
                        </Text>
                        <ProgressBar progress={progress} />
                    </>
                }
            </View>
        </View>
    )
}

const NoOrderState = ({ onPress }) => (
    <View style={[globalStyles.insetContainer, { marginTop: 20, marginHorizontal: 5 }]}>
        <Text style={[globalStyles.textBlack, globalStyles.textNormalRegular]}>
            This is where your order will appear after you placed it. {'\n'}
            You’ll be able to check how far it is from you and how long it will take the drone to deliver it. {'\n'}
            {'\n'}
            Right now you haven’t placed your first order yet. Go check some menus in the home page!
        </Text>
        <View style={{ alignSelf: 'flex-end', marginTop: 20 }}>
            <ButtonWithArrow text="Explore menus" onPress={onPress} />
        </View>
    </View>
)

const ShowOrderState = ({
    orderData,
    menuData,
    locationData
}) => {

    const showMap = locationData.isLocationAllowed && locationData.lastKnownLocation

    const userLocation = locationData.lastKnownLocation
    const droneLocation = orderData.currentPosition
    const deliveryLocation = orderData.deliveryLocation
    const menuStartLocation = menuData.menu.location

    const map = useRef(null);

    const loadMap = () => {
        console.log("Map is ready, fitting to coordinates");
        if (map.current && showMap) {
            const coords = (orderData.status === "ON_DELIVERY")
            ? [
                { latitude: userLocation.lat, longitude: userLocation.lng },
                { latitude: droneLocation.lat, longitude: droneLocation.lng },
                { latitude: deliveryLocation.lat, longitude: deliveryLocation.lng },
                { latitude: menuStartLocation.lat, longitude: menuStartLocation.lng },
            ]
            : [
                { latitude: userLocation.lat, longitude: userLocation.lng },
                { latitude: deliveryLocation.lat, longitude: deliveryLocation.lng },
                { latitude: menuStartLocation.lat, longitude: menuStartLocation.lng },
            ];

            map.current.fitToCoordinates(coords, {
                edgePadding: { top: 150, right: 100, bottom: 150, left: 100 }
            });

        }
    }

    return (
        <>
            <Header orderData={orderData} />

            {showMap &&
                <MapView
                    key={"order-map"}
                    ref={map}
                    style={styles.map}
                    showsCompass={true}
                    showsPointsOfInterest={false}
                    showsUserLocation={true}
                    loadingEnabled={true}
                    showsMyLocationButton={true}
                    onMapReady={loadMap}
                >

                    {(orderData.status === "ON_DELIVERY") && <Marker
                        coordinate={{
                            latitude: droneLocation.lat,
                            longitude: droneLocation.lng,
                        }}
                        title="Drone Location"
                        description="The current location of the drone"
                        zIndex={1}
                        >
                        <Image 
                            // @ts-ignore
                            source={require('../../../assets/drone.png')}
                            style={{ width: 30, height: 30 }}
                        />
                    </Marker>}
                    
                    <Marker
                        coordinate={{
                            latitude: deliveryLocation.lat,
                            longitude: deliveryLocation.lng,
                        }}
                        title="Delivery Place"
                        description="The Location where the drone will deliver the order"
                        zIndex={2}
                    >
                        <View style={{width: 40, height: 40, borderRadius: 20, backgroundColor: colors.lightGray, justifyContent: 'center', alignItems: 'center'}}>
                            <MyIcon name={IconNames.HOME} size={30} color={colors.black} />
                        </View>
                    </Marker>

                    <Marker
                        coordinate={{
                            latitude: menuStartLocation.lat,
                            longitude: menuStartLocation.lng,
                        }}
                        title="Restaurant Location"
                        description="The starting location of the menu you ordered"
                        zIndex={0}
                        >
                        <View style={{width: 40, height: 40, borderRadius: 20, backgroundColor: colors.lightGray, justifyContent: 'center', alignItems: 'center'}}>
                            <MyIcon name={IconNames.FOOD} size={30} color={colors.black} />
                        </View>
                    </Marker>

                </MapView>
            }

            <View style={[globalStyles.insetContainer, { paddingVertical: 25 }]}>
                <Text style={[globalStyles.textBlack, globalStyles.textSubtitleMedium]}>
                    Delivery details
                </Text>
                <View style={{ marginVertical: 5 }}>
                    <Text style={[globalStyles.textDarkGray, globalStyles.textSmallRegular, { marginTop: 15 }]}>
                        Pick it up at
                    </Text>
                    <Text style={[globalStyles.textBlack, globalStyles.textNormalRegular]}>
                        {orderData.deliveryLocation.address}
                    </Text>
                </View>
                <View style={{ marginVertical: 5 }}>
                    <Text style={[globalStyles.textDarkGray, globalStyles.textSmallRegular, { marginTop: 15 }]}>
                        Drone is currently at
                    </Text>
                    <Text style={[globalStyles.textBlack, globalStyles.textNormalRegular]}>
                        {orderData.currentPosition.address}
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
                image={menuData.image.base64}
                title={"1x " + menuData.menu.name}
                price={menuData.menu.price}
            />
        </>
    )
}

export default LastOrderScreen;

const styles = StyleSheet.create({

    map: {
        width: '100%',
        height: height * 0.24,
    },

});