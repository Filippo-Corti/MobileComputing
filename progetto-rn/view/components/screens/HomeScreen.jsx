import { View, ScrollView, Text, Button, StyleSheet, Dimensions } from 'react-native';
import MapView from 'react-native-maps';
import { useNavigation } from '@react-navigation/native';
import { globalStyles, imageBase64 } from '../../../styles/global';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import MyLogo from '../common/icons/MyLogo';
import MenuPreview from '../common/other/MenuPreview';
import { useContext } from 'react';
import { UserContext } from '../../context/UserContext';

const { height } = Dimensions.get('window');

export default HomeScreen = ({ }) => {

    const userLocation = {
        longitude: 9.167285,
        latitude: 47.662515,
    }

    const navigation = useNavigation();

    const {userData} = useContext(UserContext);

    return (
        <SafeAreaProvider>
            <SafeAreaView style={globalStyles.container}>
                <ScrollView>

                    <View style={[globalStyles.insetContainer, globalStyles.flexBetween, { marginHorizontal: 10, marginVertical: 22 }]}>
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
                    <View style={[globalStyles.insetContainer, styles.afterMap]}>
                        <View style={[globalStyles.flexCenter, { marginVertical: 20 }]}>
                            <Text style={[globalStyles.textBlack, globalStyles.textSubtitleBold]}>
                                Menus Around You
                            </Text>
                        </View>
                        <View style={[globalStyles.flexCenter, { flexDirection: 'column', marginHorizontal: 8 }]}>
                            <MenuPreview menuInformation={{
                                title: 'McMushroom Pizza',
                                price: 21,
                                description: 'Garlic, olive oil base, mozarella, cremini mushrooms, ricotta, thyme, white truffle oil. Add arugula for an extra charge',
                                deliveryTime: 30,
                                distanceFromYou: 0.2,
                                image: imageBase64,
                            }} 
                                onPress={() => navigation.navigate("MenuDetails")}
                                style={{borderTopWidth: 1}}
                            />
                            <MenuPreview menuInformation={{
                                title: 'McMushroom Pizza2',
                                price: 17,
                                description: 'Garlic, olive oil base, mozarella, cremini mushrooms, ricotta, thyme, white truffle oil. Add arugula for an extra charge',
                                deliveryTime: 30,
                                distanceFromYou: 0.2,
                                image: imageBase64,
                            }} 
                                onPress={() => navigation.navigate("MenuDetails")}
                                style={{borderTopWidth: 1}}
                            />
                            <MenuPreview menuInformation={{
                                title: 'McMushroom Pizza',
                                price: 21,
                                description: 'Garlic, olive oil base, mozarella, cremini mushrooms, ricotta, thyme, white truffle oil. Add arugula for an extra charge',
                                deliveryTime: 30,
                                distanceFromYou: 0.2,
                                image: imageBase64,
                            }} 
                                onPress={() => navigation.navigate("MenuDetails")}
                                style={{borderTopWidth: 1}}
                            />
                            <MenuPreview menuInformation={{
                                title: 'McMushroom Pizza2',
                                price: 17,
                                description: 'Garlic, olive oil base, mozarella, cremini mushrooms, ricotta, thyme, white truffle oil. Add arugula for an extra charge',
                                deliveryTime: 30,
                                distanceFromYou: 0.2,
                            }} 
                                onPress={() => navigation.navigate("MenuDetails")}
                                style={{borderTopWidth: 1}}
                            />

                        </View>
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
        height: height * 0.30,
    },

    afterMap: {
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        transform: [{ translateY: -30 }]
    }

});