import { ScrollView, View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { globalStyles } from '../../../styles/global';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import MyIcon, { IconNames } from '../common/icons/MyIcon';
import Separator from '../common/other/Separator';
import InfoTextBox from '../common/other/InfoTextBox';
import LargeButton from '../common/buttons/LargeButton';
import MenuSmallPreview from '../common/other/MenuSmallPreview';
import { useContext } from 'react';
import { AppStateContext } from '../../context/AppStateContext';
import colors from '../../../styles/colors';
import { UserContext } from '../../context/UserContext';
import React from 'react';

/**
 * @param {{
*  route: { params: { menu: MenuDetailsWithImage } }
* }} props 
* @returns {JSX.Element}
*/
const ConfirmOrderScreen = ({
    route
}) => {

    const navigation = useNavigation();
    const menuDetails = route.params.menu;

    const { appState, locationState } = useContext(AppStateContext);
    const { userState } = useContext(UserContext);

    if (appState.isLoading || !menuDetails) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    return (
        <SafeAreaProvider>
            <SafeAreaView style={[globalStyles.container, { flex: 1 }]}>
                <ScrollView contentContainerStyle={{ flexGrow: 1 }}>

                    <View style={{ flex: 1 }}>

                        <View style={{ flexDirection: 'row', marginHorizontal: 15, marginVertical: 25, }}>
                            <TouchableOpacity onPress={() => navigation.goBack()} >
                                <MyIcon name={IconNames.ARROW_LEFT} size={32} color={colors.black} />
                            </TouchableOpacity>
                            <Text style={[globalStyles.textBlack, globalStyles.textTitleRegular, { flex: 1, textAlign: 'center', marginEnd: 20 }]}>
                                Your order
                            </Text>
                        </View>

                        <InfoTextBox
                            iconName={IconNames.MARKER}
                            label={"Menu Location"}
                            text={menuDetails.menuDetails.location.address}
                        />
                        {locationState.lastKnownLocation && locationState.lastKnownLocation.address &&
                            <>
                                <Separator size={1} color={colors.lightGray} />
                                <InfoTextBox
                                    iconName={IconNames.HOME}
                                    label={"Your Location"}
                                    text={locationState.lastKnownLocation?.address}
                                />
                            </>
                        }
                        <Separator size={10} color={colors.lightGray} />
                        <View style={[globalStyles.flexBetween, globalStyles.insetContainer, { marginVertical: 20 }]}>
                            <Text style={[globalStyles.textBlack, globalStyles.textNormalMedium]}>
                                Delivery Time
                            </Text>
                            <Text style={[globalStyles.textBlack, globalStyles.textNormalMedium]}>
                                {menuDetails.menuDetails.deliveryTime} min(s)
                            </Text>
                        </View>
                        <Separator size={10} color={colors.lightGray} />

                        <MenuSmallPreview
                            image={menuDetails.image.base64}
                            title={menuDetails.menuDetails.name}
                            price={menuDetails.menuDetails.price}
                        />
                        <Separator size={1} color={colors.lightGray} />
                        <View style={[globalStyles.flexBetween, globalStyles.insetContainer, { marginVertical: 20 }]}>
                            <Text style={[globalStyles.textBlack, globalStyles.textNormalMedium]}>
                                Total
                            </Text>
                            <Text style={[globalStyles.textBlack, globalStyles.textNormalMedium]}>
                                {"€" + menuDetails.menuDetails.price}
                            </Text>
                        </View>
                        <Separator size={1} color={colors.lightGray} />

                        {userState.user &&
                            <View style={[globalStyles.insetContainer, { marginTop: 20 }]}>
                                <Text style={[globalStyles.textBlack, globalStyles.textNormalMedium]}>
                                    Payment Method
                                </Text>
                                <View style={[globalStyles.flexBetween, { gap: 20, margin: 20, }]}>
                                    <View>
                                        <MyIcon name={IconNames.CREDIT_CARD} size={32} color={colors.gray} />
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={[globalStyles.textDarkGray, globalStyles.textNormalRegular]}>
                                            {userState.user.cardFullName}'s Credit Card {'\n'}
                                            {userState.user.cardNumber}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        }


                    </View>

                    <View style={[globalStyles.insetContainer, { marginTop: 25, marginBottom: 5 }]}>
                        <Text style={[globalStyles.textBlack, globalStyles.textSmallRegular, { marginVertical: 15, }]}>
                            If you’re not around when the courier arrives, they’ll leave
                            your order at the door. By placing your order, you agree
                            to take full responsibilty for it once it’s delivered.
                        </Text>
                        <LargeButton text="Confirm and Pay" onPress={() => console.log("Pressed")} />
                    </View>

                </ScrollView>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}

export default ConfirmOrderScreen;
