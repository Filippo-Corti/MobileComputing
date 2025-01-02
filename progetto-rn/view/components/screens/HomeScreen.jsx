import { View, ScrollView, Text, FlatList, StyleSheet, Dimensions, ActivityIndicator, RefreshControl } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
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
        const location = locationState.lastKnownLocation;
        if (appState.isLoading || !location) return;

        try {
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
        }
    };

    const onRefresh = useCallback(() => {
        setIsRefreshing(true);
        fetchMenus().then(() => setIsRefreshing(false));
    }, []);


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
                <MyLogo />
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

                <MenusMap nearestMenus={nearestMenus} />

                <MenusList nearestMenus={nearestMenus} onItemClick={(menuId) => navigateToMenuDetails(menuId)} />

                <StatusBar style="auto" />
            </ScrollView>
        </SafeAreaView>
    );
}

const Header = ({ user }) => (
    <View style={[globalStyles.insetContainer, globalStyles.flexBetween, { marginHorizontal: 10, marginTop: 22 }]}>
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

const MenusMap = ({
    nearestMenus
}) => {
    
    return (
        <MapView
            key={"menus-map"}
            style={styles.map}
            showsCompass={true}
            showsPointsOfInterest={false}
            showsUserLocation={true}
            followsUserLocation={true}
            loadingEnabled={true}
            showsMyLocationButton={true}
            scrollEnabled={false}
            rotateEnabled={false} 
            pitchEnabled={false}
            zoomEnabled={true}
        >
            {nearestMenus?.map((menu, index) => (<Marker
                    key={menu.menu.mid}
                    coordinate={{
                        latitude: menu.menu.location.lat,
                        longitude: menu.menu.location.lng,
                    }}
                    title={menu.menu.name}
                    description={menu.menu.description}
                />
            ))}

        </MapView>
    )
}

const MenusList = ({
    nearestMenus,
    onItemClick
}) => (
    <View style={[globalStyles.insetContainer, styles.afterMap, { flex: 1 }]}>

        <View style={[globalStyles.flexCenter, { marginVertical: 20 }]}>
            <Text style={[globalStyles.textBlack, globalStyles.textSubtitleBold]}>
                Menus Around You
            </Text>
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