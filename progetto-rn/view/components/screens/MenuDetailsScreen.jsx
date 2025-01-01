import { ScrollView, View, Text, Image, TouchableOpacity, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { globalStyles } from '../../../styles/global';
import { SafeAreaView } from 'react-native-safe-area-context';
import MyIcon, { IconNames } from '../common/icons/MyIcon';
import Separator from '../common/other/Separator';
import InfoTextBox from '../common/other/InfoTextBox';
import LargeButton from '../common/buttons/LargeButton';
import { useContext, useEffect, useState } from 'react';
import ViewModel from '../../../viewmodel/ViewModel';
import { AppStateContext } from '../../context/AppStateContext';
import colors from '../../../styles/colors';

const { height } = Dimensions.get('window');

/**
 * @param {{
 *  route: { params: { menuId: number } }
 * }} props 
 * @returns {JSX.Element}
 */
const MenuDetailsScreen = ({ 
    route
}) => {

    const navigation = useNavigation();
    const menuId = route.params.menuId;

    /** @type {[MenuDetailsWithImage, React.Dispatch<React.SetStateAction<MenuDetailsWithImage>>]} */
    const [menuDetails, setMenuDetails] = useState(null);
    
    const { appState, locationState } = useContext(AppStateContext);

    const navigateToConfirmOrder = () => {
        // @ts-ignore
        navigation.navigate("ConfirmOrder", { menu: menuDetails });
    }

    useEffect(() => {
        const fetchMenuDetails = async () => {
            if (menuDetails && menuDetails.menuDetails.mid === menuId) return;
            const menu = await ViewModel.fetchMenuDetails(
                locationState.lastKnownLocation.lat,
                locationState.lastKnownLocation.lng,
                menuId
            );
            setMenuDetails(menu);
            console.log("Menu Details Fetched");
        };

        fetchMenuDetails();
    }, [menuId]);


    if (appState.isLoading || !menuDetails || menuDetails.menuDetails.mid !== menuId) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    return (
        <SafeAreaView style={[globalStyles.container, { flex: 1 }]}>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>

                <View style={{ flex: 1 }}>
                    <View style={styles.imageContainer}>
                        {menuDetails.image && <Image source={{ uri: menuDetails.image.base64 }} style={styles.image} />}
                        {!menuDetails.image && <View style={styles.iconContainer}>
                            <MyIcon name={IconNames.FOOD} size={100} color={colors.gray} />
                        </View>}
                        <TouchableOpacity style={[styles.backArrowContainer, { borderWidth: (!menuDetails.image) ? 1 : 0 }]} onPress={() => navigation.goBack()}>
                            <MyIcon name={IconNames.ARROW_LEFT} size={32} color={colors.black} />
                        </TouchableOpacity>
                    </View>

                    <View style={[globalStyles.insetContainer, { marginVertical: 20 }]}>
                        <Text style={[globalStyles.textBlack, globalStyles.textTitleBold, {marginTop: 5, marginBottom: 10,}]}>
                            {menuDetails.menuDetails.name}
                        </Text>

                        <View style={{ flexDirection: 'row', justifyContent: 'flex-start', gap: 5, marginBottom: 10 }}>
                            <MyIcon name={IconNames.PRICE_TAG} size={22} color={colors.primary} />
                            <Text style={[globalStyles.textDarkGray, globalStyles.textSubtitleMedium]}>
                                €{menuDetails.menuDetails.price}
                            </Text>
                        </View>

                        <Text style={[globalStyles.textBlack, globalStyles.textNormalRegular, {marginTop: 10,}]}>
                            {menuDetails.menuDetails.longDescription}
                        </Text>
                    </View>

                    <Separator size={10} color={colors.lightGray} />
                    <InfoTextBox
                        iconName={IconNames.MARKER}
                        label={"Menu Location"}
                        text={menuDetails.menuDetails.location.address}
                    />
                    <Separator size={10} color={colors.lightGray} />
                    <InfoTextBox
                        iconName={IconNames.CLOCK}
                        text={"Approximately " + menuDetails.menuDetails.deliveryTime + " min(s)"}
                    />
                    <Separator size={1} color={colors.lightGray} />
                </View>

                <View style={[globalStyles.insetContainer, { marginTop: 25, marginBottom: 5 }]}>
                    <LargeButton 
                        text={"Order • €" + menuDetails.menuDetails.price} 
                        onPress={navigateToConfirmOrder}
                    />
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}

export default MenuDetailsScreen;

const styles = StyleSheet.create({

    imageContainer: {
        width: '100%',
        height: height * 0.25,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },

    iconContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },

    backArrowContainer: {
        padding: 10,
        backgroundColor: colors.white,
        borderRadius: '50%',
        position: 'absolute',
        left: 10,
        top: 10,
    },

    image: {
        width: '100%',
        height: '100%',
    }

});