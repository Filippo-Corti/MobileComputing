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
import { useContext, useState, useEffect } from 'react';
import ViewModel from '../../../viewmodel/ViewModel';

export default AccountScreen = ({ }) => {

    const navigation = useNavigation();

    const [viewModel, setViewModel] = useState(null);
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

    useEffect(() => {
        const initializeAndFetch = async () => {
            if (!viewModel)
                await initViewModel();

            if (viewModel) {
                if (orderData && orderData.id && !orderData.orderDetailsRetrieved) 
                    await fetchLastOrder();
            }
        };

        initializeAndFetch();
    }, [userData, orderData, viewModel]);

    console.log("User Data is", userData);
    console.log("Order data is", orderData);

    const showOrder = (orderData && orderData.id && orderData.orderDetailsRetrieved);

    return (
        <SafeAreaProvider>
            <SafeAreaView style={[globalStyles.container, { flex: 1 }]}>
                <ScrollView contentContainerStyle={[globalStyles.flexCenter, { flexDirection: 'column', justifyContent: 'flex-start', flexGrow: 1, marginTop: 35, }]}>

                    <View style={{ marginBottom: 15, alignItems: 'center' }}>
                        <Image
                            style={styles.profileImage}
                            source={require('../../../assets/default-avatar.jpg')}
                        />

                        {userData && <Text style={[globalStyles.textBlack, globalStyles.textNormalRegular, { marginBottom: 13, textAlign: 'center' }]}>
                            {userData.fName} {userData.lName}
                        </Text>}

                        {(userData)
                            ? <MinimalistButton text="EDIT ACCOUNT" onPress={() => navigation.navigate("EditAccount")} />
                            : <MinimalistButton text="NEW ACCOUNT" onPress={() => navigation.navigate("EditAccount", { newAccount: true })} />
                        }
                    </View>

                    <Separator size={1} color={colors.lightGray} />

                    {showOrder && <>

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
                            <MenuPreview menuInformation={{
                                title: orderData.menu.name,
                                price: orderData.menu.formatPrice(),
                                description: orderData.menu.shortDescription,
                                deliveryTime: orderData.menu.deliveryTime,
                                distanceFromYou: "--",
                                image: orderData.menu.image,
                            }}
                                onPress={() => navigation.navigate("HomeStack", { screen: "MenuDetails" })}
                                style={{ marginTop: 8, }}
                            />
                        </View>

                        <Separator size={1} color={colors.lightGray} />
                    </>
                    }

                    {userData && <>
                        <View style={[globalStyles.insetContainer, { marginTop: 20, marginBottom: 40, width: '95%' }]}>

                            <CreditCard cardInformation={{
                                number: userData.ccNumber,
                                holder: userData.ccFullName,
                                expiryMonth: userData.ccExpMonth,
                                expiryYear: userData.ccExpYear,
                            }} />

                        </View>
                    </>
                    }

                </ScrollView>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({

    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 10,
    }

});

