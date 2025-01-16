import { View, ScrollView, Text, FlatList, StyleSheet, Dimensions, ActivityIndicator, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { globalStyles } from '../../../styles/global';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import MyLogo from '../common/icons/MyLogo';
import MenuPreview from '../common/other/MenuPreview';
import { useContext, useState, useEffect, useCallback, useRef } from 'react';
import { UserContext } from '../../context/UserContext';
import { AppStateContext } from '../../context/AppStateContext';
import ViewModel from '../../../viewmodel/ViewModel';
import colors from '../../../styles/colors';
import React from 'react';
import MinimalistButton from '../common/buttons/MinimalistButton';
import MyError from '../../../model/types/MyError';

const { height } = Dimensions.get('window');

/**
 * @returns {JSX.Element}
 */
const HomeScreen = ({ }) => {

    const navigation = useNavigation();

    /** @type {[Array<MenuWithImage>, React.Dispatch<React.SetStateAction<Array<MenuWithImage>>>]} */
    const [nearestMenus, setNearestMenus] = useState([]);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const { appState, locationState, setError } = useContext(AppStateContext);
    const { userState } = useContext(UserContext);

    const navigateToMenuDetails = (menuId) => {
        // @ts-ignore
        navigation.navigate("MenuDetails", { menuId });
    }

    const fetchMenus = async () => {
        if (appState.isLoading) return;

        const location = locationState.lastKnownLocation || ViewModel.DEFAULT_LOCATION;

        try {
            setIsRefreshing(true);
            const menus = await ViewModel.fetchNearbyMenus(
                location.lat,
                location.lng
            );
            setNearestMenus(menus);
            // Lazy Load Images
            menus.forEach(menu => {
                ViewModel.fetchMenuImage(menu.menu.mid, menu.menu.imageVersion).then((image) => {
                    setNearestMenus(prevState => {
                        const newMenus = [...prevState];
                        const index = newMenus.findIndex(m => m.menu.mid === menu.menu.mid);
                        newMenus[index].image = image;
                        return newMenus;
                    })
                })
            });
        } catch (err) {
            setError(err)
        } finally {
            setIsRefreshing(false);
        }
    };

    const onRefresh = useCallback(() => {
        setIsRefreshing(true);
        fetchMenus().then(() => setIsRefreshing(false));
    }, [
        locationState.lastKnownLocation?.lat,
        locationState.lastKnownLocation?.lng
    ]);

    useEffect(() => {
        fetchMenus();
    }, [
        locationState.lastKnownLocation?.lat,
        locationState.lastKnownLocation?.lng,
        appState.isLoading
    ]);

    if (appState.isLoading || !nearestMenus) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    return (
        <SafeAreaView style={globalStyles.container}>
            <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={isRefreshing}
                        onRefresh={onRefresh}
                    />
                }
            >

                <Header user={userState.user} />

                <MenusList
                    nearestMenus={nearestMenus}
                    locationData={locationState}
                    onItemClick={(menuId) => navigateToMenuDetails(menuId)}
                    onEnableLocationClick={() => {
                        setError(new MyError(
                            "POSITION_UNALLOWED",
                            "We need your Location",
                            "This app requires your location to work properly. \nIn case you deny the permission, some features may not work as expected.",
                            "I'll do it"
                        ));
                        console.log("Error is now: ", appState.error);
                    }}
                />

                <StatusBar style="auto" />
            </ScrollView>
        </SafeAreaView>
    );
}

const Header = ({ user }) => (
    <View style={[globalStyles.insetContainer, globalStyles.flexBetween, { marginHorizontal: 10, marginTop: 22, marginBottom: 10 }]}>
        <View>
            <Text style={[globalStyles.textBlack, globalStyles.textSubtitleMedium]}>
                Welcome Back{(user) ? ", " + user.firstName : ""}
            </Text>
            <Text style={[globalStyles.textDarkGray, globalStyles.textNormalRegular]}>
                What are you craving?
            </Text>
        </View>
        <View>
            <MyLogo />
        </View>
    </View>
);

const MenusList = ({
    nearestMenus,
    locationData,
    onItemClick,
    onEnableLocationClick
}) => (
    <View style={[globalStyles.insetContainer, styles.afterMap, { flex: 1 }]}>

        <View style={[globalStyles.flexCenter, { marginVertical: 20 }]}>
            {(locationData.lastKnownLocation)
                ?
                <Text style={[globalStyles.textBlack, globalStyles.textSubtitleBold]}>
                    Menus Around You
                </Text>
                :
                <View style={{alignItems: 'center'}}>
                    <Text style={[globalStyles.textBlack, globalStyles.textSubtitleBold, {marginBottom: 10}]}>
                        Menus in {ViewModel.DEFAULT_LOCATION.address}
                    </Text>
                    <Text style={[globalStyles.textDarkGray, globalStyles.textNormalRegular]}>
                        Want localized results? 
                    </Text>
                    <View>
                        <MinimalistButton text="ALLOW LOCATION" onPress={onEnableLocationClick} />
                    </View>
                </View>
            }
        </View>

        {nearestMenus && <FlatList
            data={nearestMenus}
            renderItem={({ item }) =>
                <MenuPreview
                    menu={item}
                    onPress={() => {
                        onItemClick(item.menu.mid);
                    }}
                    style={{ borderTopWidth: 1 }}
                />
            }
            contentContainerStyle={{ flexGrow: 1 }}
            keyExtractor={item => item.menu.mid}
            scrollEnabled={false}
            style={{
                flex: 1,
            }}
        />}
    </View>
)

const styles = StyleSheet.create({

    map: {
        width: '100%',
        height: height * 0.20,
        marginVertical: 5,
    },

    afterMap: {
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    }

});

export default HomeScreen;