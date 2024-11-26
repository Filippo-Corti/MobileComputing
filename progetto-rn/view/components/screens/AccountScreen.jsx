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
import { useContext } from 'react';

export default AccountScreen = ({ }) => {

    const navigation = useNavigation();

    const { userData, orderData, setOrderData } = useContext(UserContext);

    console.log("User Data is", userData);
    console.log("Order data is", orderData);

    if (orderData.oid && !orderData.orderDetailsRetrieved) { // If there is an order but we don't have the details
        console.log("Need to retrieve order details");
    }

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

                    {orderData.oid && orderData.orderDetailsRetrieved && <>

                        <View style={[globalStyles.insetContainer, { marginVertical: 20, }]}>
                            <View style={[globalStyles.flexBetween, { width: '100%' }]}>
                                <View>
                                    <Text style={[globalStyles.textBlack, globalStyles.textSubtitleRegular]}>
                                        Your last order
                                    </Text>
                                </View>
                                <View>
                                    <ButtonWithArrow text="Order Again" onPress={() => console.log("Pressed")} />
                                </View>
                            </View>
                            <MenuPreview menuInformation={{
                                title: 'McMushroom Pizza',
                                price: 21,
                                description: 'Garlic, olive oil base, mozarella, cremini mushrooms, ricotta, thyme, white truffle oil. Add arugula for an extra charge',
                                deliveryTime: 30,
                                distanceFromYou: 0.2,
                                image: imageBase64,
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

