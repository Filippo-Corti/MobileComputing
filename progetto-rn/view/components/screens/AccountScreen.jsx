import { ScrollView, View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { globalStyles, imageBase64 } from '../../../styles/global';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import MyIcon, { IconNames } from '../common/icons/MyIcon';
import Separator from '../common/other/Separator';
import CreditCard from '../common/other/CreditCard';
import MinimalistButton from '../common/buttons/MinimalistButton';
import ButtonWithArrow from '../common/buttons/ButtonWithArrow';
import { UserContext } from '../../context/UserContext';
import { useContext, useState, useEffect, useRef } from 'react';
import ViewModel from '../../../viewmodel/ViewModel';

export default AccountScreen = ({ }) => {

    const navigation = useNavigation();

    const viewModel = ViewModel.getViewModel()
    const { userData, orderData, setOrderData } = useContext(UserContext);

    const fetchLastOrder = async () => {
        try {
            const orderDetails = await viewModel.current.getOrderAndMenuDetails(orderData.id);
            setOrderData(orderDetails);
            console.log("Fetched Order Data:", orderDetails.deliveryLocation);
        } catch (err) {
            console.error("Error fetching the last order details:", err);
        }
    }

    useEffect(() => {
        const initializeAndFetch = async () => {
            if (orderData && orderData.id && !orderData.orderDetailsRetrieved) 
                await fetchLastOrder();
        };

        initializeAndFetch();
    }, [userData, orderData]);

    console.log("User Data is", userData);
    console.log("Order data is", orderData);

    const showOrder = (orderData && orderData.id && orderData.orderDetailsRetrieved);
    const isLogged = (userData)

    return (
        <SafeAreaView style={[globalStyles.container, { flex: 1 }]}>
            <ScrollView contentContainerStyle={[globalStyles.flexCenter, { flexDirection: 'column', justifyContent: 'flex-start', flexGrow: 1, marginTop: 35, }]}>

                { (isLogged)
                    ?   
                    <>
                        <LoggedHeader userData={userData} navigation={navigation} />
                        <Separator size={1} color={colors.lightGray} />

                        { showOrder && <LastOrder orderData={orderData} /> }
                        <Separator size={1} color={colors.lightGray} />

                        <CreditCardBox userData={userData} />
                    </>
                    :
                    <>
                        <NotLoggedHeader userData={userData} navigation={navigation} />
                        <Separator size={1} color={colors.lightGray} />
                    </>
                }


            </ScrollView>
        </SafeAreaView>
    );
}


const NotLoggedHeader = ({navigation}) => (
    <View style={{ marginBottom: 15, alignItems: 'center' }}>

        <Image
            style={styles.profileImage}
            source={require('../../../assets/default-avatar.jpg')}
        />

        <MinimalistButton text="NEW ACCOUNT" onPress={() => navigation.navigate("EditAccount", { newAccount: true })} />

    </View>
)

const LoggedHeader = ({userData, navigation}) => (
    <View style={{ marginBottom: 15, alignItems: 'center' }}>
        
        <Image
            style={styles.profileImage}
            source={require('../../../assets/default-avatar.jpg')}
        />

        <Text style={[globalStyles.textBlack, globalStyles.textNormalRegular, { marginBottom: 13, textAlign: 'center' }]}>
            {userData.fName} {userData.lName}
        </Text>

        
        <MinimalistButton text="EDIT ACCOUNT" onPress={() => navigation.navigate("EditAccount")} />
        
    </View>
)

const LastOrder = ({orderData}) => (
    <View style={[globalStyles.insetContainer, { marginVertical: 20, }]}>
        <View style={[globalStyles.flexBetween, { width: '100%' }]}>
            <View>
                <Text style={[globalStyles.textBlack, globalStyles.textSubtitleRegular]}>
                    Your last order
                </Text>
            </View>
            <View>
                <ButtonWithArrow text="See More" onPress={() => navigation.navigate("LastOrder")} />
            </View>
        </View>
        <MenuPreview menuInformation={orderData.menu}
            style={{ marginTop: 8, }}
        />
    </View>
)

const CreditCardBox = ({userData}) => (
    <View style={[globalStyles.insetContainer, { marginTop: 20, marginBottom: 40, width: '95%' }]}>

        <CreditCard cardInformation={{
            number: userData.ccNumber,
            holder: userData.ccFullName,
            expiryMonth: userData.ccExpMonth,
            expiryYear: userData.ccExpYear,
        }} />

    </View>
)

const styles = StyleSheet.create({

    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 10,
    }

});

