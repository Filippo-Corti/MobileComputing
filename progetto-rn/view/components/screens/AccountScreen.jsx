import { ScrollView, View, Text, Image, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { globalStyles } from '../../../styles/global';
import { SafeAreaView } from 'react-native-safe-area-context';
import Separator from '../common/other/Separator';
import CreditCard from '../common/other/CreditCard';
import MinimalistButton from '../common/buttons/MinimalistButton';
import ButtonWithArrow from '../common/buttons/ButtonWithArrow';
import { UserContext } from '../../context/UserContext';
import { useContext, useEffect } from 'react';
import ViewModel from '../../../viewmodel/ViewModel';
import { AppStateContext } from '../../context/AppStateContext';
import MyLogo from '../common/icons/MyLogo';
import colors from '../../../styles/colors';
import React from 'react';
import MenuPreview from '../common/other/MenuPreview';
import SplashScreen from '../common/other/SplashScreen';

/**
 * @returns {JSX.Element} 
 */
const AccountScreen = ({ }) => {

    const navigation = useNavigation();

    const { appState, locationState, setError } = useContext(AppStateContext);
    const { userState, orderState, setOrderState } = useContext(UserContext);

    useEffect(() => {
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

        fetchLastOrder();
    }, []);

    if (appState.isLoading) {
         return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    if (!userState.isUserRegistered || !userState.user) {
        return (
            <SafeAreaView style={[globalStyles.container, { flex: 1 }]}>
                <NotLoggedHeader navigation={navigation} />
                <Separator size={1} color={colors.lightGray} />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={[globalStyles.container, { flex: 1 }]}>
            <ScrollView contentContainerStyle={[globalStyles.flexCenter, { flexDirection: 'column', justifyContent: 'flex-start', flexGrow: 1, marginTop: 35, }]}>
                
                <LoggedHeader userData={userState.user} navigation={navigation} />
                <Separator size={1} color={colors.lightGray} />

                {orderState.lastOrderMenu && 
                    <LastOrder 
                        menuData={orderState.lastOrderMenu}
                        orderData={orderState.lastOrder}
                        onPress={() => {
                            if (orderState.lastOrder.status === "ON_DELIVERY") {
                                // @ts-ignore
                                navigation.navigate("LastOrder")
                            } else {
                                // @ts-ignore
                                navigation.navigate("HomeStack", { 
                                    screen: "MenuDetails",
                                    params: { menuId: orderState.lastOrder.mid } 
                                })
                            }
                        }}
                    />
                }
                <Separator size={1} color={colors.lightGray} />

                <CreditCardBox userData={userState.user} />

            </ScrollView>
        </SafeAreaView>
    );
}


const NotLoggedHeader = ({ navigation }) => (
    <View style={{ marginBottom: 15, alignItems: 'center' }}>

        <Image
            style={styles.profileImage}
            // @ts-ignore
            source={require('../../../assets/default-avatar.jpg')}
        />

        <MinimalistButton text="NEW ACCOUNT" onPress={() => navigation.navigate("EditAccount", { newAccount: true })} />

    </View>
)

const LoggedHeader = ({ 
    userData, 
    navigation 
}) => (
    <View style={{ marginBottom: 15, alignItems: 'center' }}>

        <Image
            style={styles.profileImage}
            // @ts-ignore
            source={require('../../../assets/default-avatar.jpg')}
        />

        <Text style={[globalStyles.textBlack, globalStyles.textNormalRegular, { marginBottom: 13, textAlign: 'center' }]}>
            {userData.firstName} {userData.lastName}
        </Text>


        <MinimalistButton text="EDIT ACCOUNT" onPress={() => navigation.navigate("EditAccount", { newAccount: false })} />

    </View>
)

const LastOrder = ({ 
    menuData,
    orderData,
    onPress
}) => (
    <View style={[globalStyles.insetContainer, { marginVertical: 20, }]}>
        <View style={[globalStyles.flexBetween, { width: '100%' }]}>
            <View>
                <Text style={[globalStyles.textBlack, globalStyles.textSubtitleRegular]}>
                    Your last order
                </Text>
            </View>
            <View>
                {orderData.status === "ON_DELIVERY" 
                    ? <ButtonWithArrow text="Check Last Order" onPress={onPress} />
                    : <ButtonWithArrow text="Order Again" onPress={onPress} />
                }
            </View>
        </View>
        <MenuPreview 
            menu={menuData}
            style={{ marginTop: 8, }}
            onPress={null}
        />
    </View>
)

const CreditCardBox = ({ userData }) => (
    <View style={[globalStyles.insetContainer, { marginTop: 20, marginBottom: 40, width: '95%' }]}>

        <CreditCard cardInformation={{
            number: userData.cardNumber,
            holder: userData.cardFullName,
            expiryMonth: userData.cardExpireMonth,
            expiryYear: userData.cardExpireYear,
        }} />

    </View>
)

export default AccountScreen;

const styles = StyleSheet.create({

    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 10,
    }

});

