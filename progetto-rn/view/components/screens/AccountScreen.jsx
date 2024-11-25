import { ScrollView, View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { globalStyles, imageBase64 } from '../../../styles/global';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import MyIcon, { IconNames } from '../common/icons/MyIcon';
import Separator from '../common/other/Separator';
import CreditCard from '../common/other/CreditCard';
import MinimalistButton from '../common/buttons/MinimalistButton';
import ButtonWithArrow from '../common/buttons/ButtonWithArrow';

export default AccountScreen = ({ }) => {


    const accountInfo = {
        fName: 'John',
        lName: 'Doe',
        ccFullName: 'John Doe',
        ccNumber: '1234 5678 9012 3456',
        ccExpMonth: 12,
        ccExpYear: 2026,
        ccCCV: 123,
    }

    const navigation = useNavigation();

    return (
        <SafeAreaProvider>
            <SafeAreaView style={[globalStyles.container, { flex: 1 }]}>
                <ScrollView contentContainerStyle={[globalStyles.flexCenter, { flexDirection: 'column', justifyContent: 'flex-start', flexGrow: 1, marginTop: 35, }]}>

                    <View style={{ marginBottom: 15, alignItems: 'center' }}>
                        <Image
                            style={styles.profileImage}
                            source={require('../../../assets/default-avatar.jpg')}
                        />

                        <Text style={[globalStyles.textBlack, globalStyles.textNormalRegular, { marginBottom: 13, textAlign: 'center' }]}>
                            {accountInfo.fName} {accountInfo.lName}
                        </Text>

                        <MinimalistButton text="EDIT ACCOUNT" onPress={() => navigation.navigate("EditAccount")} />
                    </View>

                    <Separator size={1} color={colors.lightGray} />

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

                    <View style={[globalStyles.insetContainer, { marginVertical: 20, width: '90%' }]}>

                        <CreditCard cardInformation={{
                            number: accountInfo.ccNumber,
                            holder: accountInfo.ccFullName,
                            expiryMonth: accountInfo.ccExpMonth,
                            expiryYear: accountInfo.ccExpYear,
                        }} />
                    
                    </View>

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

