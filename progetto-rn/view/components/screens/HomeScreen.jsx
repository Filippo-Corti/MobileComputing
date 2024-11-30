import { View, ScrollView, Text, FlatList, StyleSheet, Dimensions } from 'react-native';
import MapView from 'react-native-maps';
import { useNavigation } from '@react-navigation/native';
import { globalStyles, imageBase64 } from '../../../styles/global';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import MyLogo from '../common/icons/MyLogo';
import MenuPreview from '../common/other/MenuPreview';
import { useContext, useState, useEffect } from 'react';
import { UserContext } from '../../context/UserContext';
import ViewModel from '../../../viewmodel/ViewModel';

const { height } = Dimensions.get('window');

export default HomeScreen = ({ }) => {

    const userLocation = {
        longitude: -122.427,
        latitude: 37.422,
    }

    const navigation = useNavigation();

    const [viewModel, setViewModel] = useState(null);
    const [nearestMenus, setNearestMenus] = useState([]);
    const { userData } = useContext(UserContext);


    const initViewModel = async () => {
        try {
            const newViewModel = ViewModel.getViewModel();
            setViewModel(newViewModel);
        } catch (err) {
            console.error("Error loading the View Model:", err);
        }
    }

    const fetchNearestMenus = async () => {
        try {
            const menus = await viewModel.getNearestMenus(userLocation);
            setNearestMenus(menus);
            console.log("Fetched Nearest Menus Data:", menus);
        } catch (err) {
            console.error("Error fetching the last order details:", err);
        }
    }

    useEffect(() => {
        const initializeAndFetch = async () => {
            if (!viewModel)
                await initViewModel();

            if (viewModel) {
                await fetchNearestMenus();
            }
        };

        initializeAndFetch();
    }, [viewModel]);

    console.log("Nearest menus are", nearestMenus.length > 0, nearestMenus.length)

    return (
        <SafeAreaProvider>
            <SafeAreaView style={globalStyles.container}>
                <ScrollView>

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

                    <MapView
                        style={styles.map}
                        initialRegion={{
                            ...userLocation,
                            latitudeDelta: 0.01,
                            longitudeDelta: 0.01,
                        }}
                    />

                    <View style={[globalStyles.insetContainer, styles.afterMap, { flex: 1 }]}>

                        <View style={[globalStyles.flexCenter, { marginVertical: 20 }]}>
                            <Text style={[globalStyles.textBlack, globalStyles.textSubtitleBold]}>
                                Menus Around You
                            </Text>
                        </View>

                        <FlatList
                            data={nearestMenus}
                            renderItem={async ({ item }) => {
                                if (!item.image) {
                                    const image = await viewModel.getMenuImage(item.id, item.imageVersion);
                                    item.image = image;
                                }
                                return (<MenuPreview
                                    menuInformation={item}
                                    onPress={() => navigation.navigate("MenuDetails")}
                                    style={{ borderTopWidth: 1 }}
                                />)
                            }}
                            contentContainerStyle={{ flexGrow: 1 }}
                            keyExtractor={item => item.id}
                            scrollEnabled={false}
                            style={{
                                flex: 1,
                            }}
                        />
                    </View>

                    <StatusBar style="auto" />
                </ScrollView>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}

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