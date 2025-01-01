import { View, ScrollView, Text, FlatList, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import MapView from 'react-native-maps';
import { useNavigation } from '@react-navigation/native';
import { globalStyles } from '../../../styles/global';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import MyLogo from '../common/icons/MyLogo';
import MenuPreview from '../common/other/MenuPreview';
import { useContext, useState, useEffect } from 'react';
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

    const [nearestMenus, setNearestMenus] = useState([]);
    const { appState, locationState } = useContext(AppStateContext);
    const { userData } = useContext(UserContext);


    useEffect(() => {
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
                appState.setAppState(prevState => ({
                    ...prevState,
                    error: err
                }));
            }
        };

        fetchMenus();
    }, [
        locationState.lastKnownLocation?.lat,
        locationState.lastKnownLocation?.lng,
        appState.isLoading
    ]);

    console.log("Location State is", locationState);

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
            <ScrollView>

                <Header userData={userData} />


                <MenusList nearestMenus={nearestMenus} navigation={navigation} />

                <StatusBar style="auto" />
            </ScrollView>
        </SafeAreaView>
    );
}

const Header = ({ userData }) => (
    <View style={[globalStyles.insetContainer, globalStyles.flexBetween, { marginHorizontal: 10, marginTop: 22 }]}>
        <View>
            <Text style={[globalStyles.textBlack, globalStyles.textSubtitleMedium]}>
                Welcome Back{(userData) ? ", " + userData.fName : ""}
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

const MenusList = ({ nearestMenus, navigation }) => (
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
                    onPress={() => navigation.navigate("MenuDetails")}
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
        height: height * 0.30 + 30,
        transform: [{ translateY: 30 }]
    },

    afterMap: {
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    }

});

export default HomeScreen;