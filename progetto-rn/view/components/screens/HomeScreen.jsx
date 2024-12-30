import { View, ScrollView, Text, FlatList, StyleSheet, Dimensions } from 'react-native';
import MapView from 'react-native-maps';
import { useNavigation } from '@react-navigation/native';
import { globalStyles } from '../../../styles/global';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import MyLogo from '../common/icons/MyLogo';
import MenuPreview from '../common/other/MenuPreview';
import { useContext, useState, useEffect, useRef } from 'react';
import { UserContext } from '../../context/UserContext';
import ViewModel from '../../../viewmodel/ViewModel';

const { height } = Dimensions.get('window');

const HomeScreen = ({ }) => {

    const navigation = useNavigation();

    const [nearestMenus, setNearestMenus] = useState([]);
    const { userData } = useContext(UserContext);

    const fetchNearestMenus = async () => {
        try {
            // const menus = await viewModel.getNearestMenusWithImages(userLocation);
            //setNearestMenus(menus);
           // console.log("Fetched Nearest Menus Data:", menus.length);
        } catch (err) {
            console.error("Error fetching the nearest menus details:", err);
        }
    }

    useEffect(() => {
        const initializeAndFetch = async () => {
            await fetchNearestMenus();
        };

        initializeAndFetch();
    }, []);


    console.log("Nearest menus are", nearestMenus.length)

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
            renderItem={({ item }) => {
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