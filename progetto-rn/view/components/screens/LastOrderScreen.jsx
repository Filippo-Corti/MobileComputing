import { View, ScrollView, Text, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useNavigation } from '@react-navigation/native';
import { globalStyles } from '../../../styles/global';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import ProgressBar from '../common/other/ProgressBar';
import { UserContext } from '../../context/UserContext';
import { useContext, useEffect, useRef } from 'react';
import ButtonWithArrow from '../common/buttons/ButtonWithArrow';
import ViewModel from '../../../viewmodel/ViewModel';
import MenuSmallPreview from '../common/other/MenuSmallPreview';
import { useIsFocused } from '@react-navigation/native';
import React from 'react';
import Separator from '../common/other/Separator';
import colors from '../../../styles/colors';
import { AppStateContext } from '../../context/AppStateContext';
import MyLogo from '../common/icons/MyLogo';

const { height } = Dimensions.get('window');

/**
 * @returns {JSX.Element} 
 */
const LastOrderScreen = ({ }) => {

    const navigation = useNavigation();

    const { userState, orderState, setOrderState } = useContext(UserContext);
    const { appState, locationState, setError } = useContext(AppStateContext);

    const fetchLastOrder = async () => {
        if (!userState.user.lastOid) return;
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
        }
    }

    // Auto - Reload every 5 seconds
    const isFocused = useIsFocused(); // Tracks if the screen is currently focused
    const intervalId = useRef(null);

    useEffect(() => {
        if (isFocused) {
            console.log("Screen is focused, starting timer");
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

    if (appState.isLoading || !orderState.lastOrder || !orderState.lastOrderMenu) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <MyLogo />
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    if (!userState.isUserRegistered || !userState.user || !userState.user.lastOid) {
        return (
            <NoOrderState 
                // @ts-ignore
                onPress={() => navigation.navigate("HomeStack")} 
            />
        );

    }

    return (
        <SafeAreaView style={globalStyles.container}>
            <ScrollView>
                    
                    <ShowOrderState 
                        orderData={orderState.lastOrder} 
                        menuData={orderState.lastOrderMenu}
                    />

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
    menuData
}) => (
    <>

        {/* <Header timeInfo={timeInfo} /> */}

        {/* <MapView
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

        </MapView> */}
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

export default LastOrderScreen;

const styles = StyleSheet.create({

    map: {
        width: '100%',
        height: height * 0.20,
    },

});