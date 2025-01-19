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
import React from 'react';

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

    const [savedText, setSavedText] = useState(null);
    const [isMenuSaved, setIsMenuSaved] = useState(false);

    const { appState, setAppState, locationState } = useContext(AppStateContext);

    const navigateToConfirmOrder = () => {
        // @ts-ignore
        navigation.navigate("ConfirmOrder", { menu: menuDetails });
    }

    const onSaveInFavourites = () => {
        ViewModel.addFavouriteMenu(menuId).then(() => {
            setSavedText("Menu Saved!");
            setAppState(prevState => ({
                ...prevState,
                reloadFavourites: true,
            }))
            setIsMenuSaved(true)
        })
    }

    const onRemoveFromFavourites = () => {
        ViewModel.removeFavouriteMenu(menuId).then(() => {
            setSavedText("Menu Removed!");
            setAppState(prevState => ({
                ...prevState,
                reloadFavourites: true,
            }))
            setIsMenuSaved(false)
        })
    }

    useEffect(() => {
        const checkMenuSaved = async () => {
            const saved = await ViewModel.isFavouriteMenu(menuId)
            setIsMenuSaved(saved)
        }

        checkMenuSaved();
    }, [appState.reloadFavourites])

    useEffect(() => {
        const fetchMenuDetails = async () => {
            if (menuDetails && menuDetails.menu.mid === menuId) return;

            const location = locationState.lastKnownLocation || ViewModel.DEFAULT_LOCATION;

            const menu = await ViewModel.fetchMenuDetails(
                location.lat,
                location.lng,
                menuId
            );
            setMenuDetails(menu);
            console.log("Menu Details Fetched");
        };

        fetchMenuDetails();
    }, [menuId]);

    if (appState.isLoading || !menuDetails || menuDetails.menu.mid !== menuId) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    const price = menuDetails.menu.price.toFixed(2);
    const deliveryTime = (menuDetails.menu.deliveryTime > 0) ? menuDetails.menu.deliveryTime : "<1";


    return (
        <SafeAreaView style={[globalStyles.container, { flex: 1 }]}>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>

                <View style={{ flex: 1 }}>
                    <View style={styles.imageContainer}>
                        {menuDetails.image && <Image source={{ uri: menuDetails.image.base64 }} style={styles.image} />}
                        {!menuDetails.image && <View style={styles.iconContainer}>
                            <MyIcon name={IconNames.FOOD} size={100} color={colors.gray} />
                        </View>}
                        <TouchableOpacity style={[styles.backArrowContainer, { borderWidth: (!menuDetails.image) ? 1 : 0 }]} onPress={() => {
                            try {
                                navigation.goBack()
                            } catch (e) {  // @ts-ignore
                                navigation.navigate("Home")
                            }
                        }}>
                            <MyIcon name={IconNames.ARROW_LEFT} size={32} color={colors.black} />
                        </TouchableOpacity>
                    </View>

                    <View style={[globalStyles.insetContainer, { marginVertical: 20 }]}>

                        {savedText && <Text style={[globalStyles.textBlack, globalStyles.textTitleRegular, styles.savedText]}>
                            {savedText}
                        </Text>}

                        <Text style={[globalStyles.textBlack, globalStyles.textTitleBold, { marginTop: 5, marginBottom: 10, }]}>
                            {menuDetails.menu.name}
                        </Text>

                        <View style={{ flexDirection: 'row', justifyContent: 'flex-start', gap: 5, marginBottom: 10 }}>
                            <MyIcon name={IconNames.PRICE_TAG} size={22} color={colors.primary} />
                            <Text style={[globalStyles.textDarkGray, globalStyles.textSubtitleMedium]}>
                                €{price}
                            </Text>
                        </View>

                        <Text style={[globalStyles.textBlack, globalStyles.textNormalRegular, { marginTop: 10, }]}>
                            {menuDetails.menu.longDescription}
                        </Text>
                    </View>

                    <Separator size={10} color={colors.lightGray} />

                    {locationState.lastKnownLocation && menuDetails.menu.location.address &&
                        <>
                            <InfoTextBox
                                iconName={IconNames.MARKER}
                                label={"Menu Location"}
                                text={menuDetails.menu.location.address}
                            />
                            <Separator size={10} color={colors.lightGray} />
                            <InfoTextBox
                                iconName={IconNames.CLOCK}
                                text={"Approximately " + deliveryTime + " min(s)"}
                            />
                            <Separator size={1} color={colors.lightGray} />
                        </>
                    }
                </View>

                <View style={[globalStyles.insetContainer, { marginTop: 25, marginBottom: 5, gap: 6 }]}>
                    {(isMenuSaved)
                        ? (
                            <LargeButton
                                text={"Remove from Favourites"}
                                onPress={onRemoveFromFavourites}
                                gray={true}
                            />)
                        : (
                            <LargeButton
                                text={"Save in Favourites"}
                                onPress={onSaveInFavourites}
                                gray={true}
                            />)
                    }
                    < LargeButton
                        text={"Order • €" + price}
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
    },

    savedText: {
        textAlign: 'center',
        marginBottom: 10,
        padding: 10,
        backgroundColor: colors.lightGray,
        borderRadius: 5,
        borderColor: colors.black,
        borderWidth: 2,
    }

});