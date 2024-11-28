import { ScrollView, View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { globalStyles, imageBase64 } from '../../../styles/global';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import MyIcon, { IconNames } from '../common/icons/MyIcon';
import Separator from '../common/other/Separator';
import LargeButton from '../common/buttons/LargeButton';
import { set, useForm } from 'react-hook-form';
import FormField from '../common/forms/FormField';
import SelectNumber from '../common/forms/SelectNumber';
import User from '../../../model/types/User';
import { UserContext } from '../../context/UserContext';
import { useContext } from 'react';
import ViewModel from '../../../viewmodel/ViewModel';
import Order from '../../../model/types/Order';

export default ConfirmOrderScreen = ({ route }) => {
    
    const viewModel = ViewModel.getViewModel();

    const navigation = useNavigation();

    const { newAccount } = route?.params || false;

    const { userData, setUserData, orderData, setOrderData } = useContext(UserContext);

    const { control, handleSubmit, formState: { errors }, } = useForm((!newAccount && userData) ? {
        defaultValues: {
            ...userData
        }
    } : {
        defaultValues: {
            ccExpMonth: 1,
            ccExpYear: 2025,
        }
    });

    const handleSaveChanges = async (formData) => {
        console.log("Params OK")
        console.log(formData);

        // Update user details on the server
        await viewModel.updateUserDetails(formData);

        // Update user details in the app context
        setUserData(formData);
        if (!orderData) {
            setOrderData(new Order(null, null, false)); 
        }
        console.log("Update OK");

        navigation.navigate("Account");
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
                                {(newAccount) ? "New Account" : "Your Account"}
                            </Text>
                        </View>

                        <View style={[globalStyles.insetContainer, { marginBottom: 15, }]}>
                            <Text style={[globalStyles.textBlack, globalStyles.textSubtitleMedium, { marginBottom: 12, }]}>
                                General Information
                            </Text>
                            <View>
                                <FormField
                                    name="fName"
                                    label="First Name"
                                    control={control}
                                    error={errors.fName}
                                    validate={(fName) => User.validateFirstName(fName) || "First Name must be less than 15 characters long and not empty"}
                                    inputMode="text"
                                    autoCapitalize="words"
                                />

                                <FormField
                                    name="lName"
                                    label="Last Name"
                                    control={control}
                                    error={errors.lName}
                                    validate={(lName) => User.validateLastName(lName) || "Last Name must be less than 15 characters long and not empty"}
                                    inputMode="text"
                                    autoCapitalize="words"
                                />
                            </View>
                        </View>

                        <Separator size={10} color={colors.lightGray} />

                        <View style={[globalStyles.insetContainer, { marginBottom: 15, marginTop: 20, }]}>
                            <Text style={[globalStyles.textBlack, globalStyles.textSubtitleMedium, { marginBottom: 12, }]}>
                                Payment method • Credit Card
                            </Text>
                            <View>
                                <FormField
                                    name="ccFullName"
                                    label="Holder Name"
                                    control={control}
                                    error={errors.ccFullName}
                                    validate={(ccFullName) => User.validateFullName(ccFullName) || "Holder Name must be less than 31 characters long and not empty"}
                                    inputMode="text"
                                    autoCapitalize="words"
                                />

                                <FormField
                                    name="ccNumber"
                                    label="Number"
                                    control={control}
                                    error={errors.ccNumber}
                                    validate={(ccNumber) => User.validateNumber(ccNumber) || "Number must be 16 digits long, with no blank spaces"}
                                    inputMode="numeric"
                                />

                                <View style={{ marginVertical: 15 }}>
                                    <Text style={[globalStyles.textDarkGray, globalStyles.textRegularNormal, { marginBottom: 10, }]}>Expiry Date </Text>
                                    <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                                        <SelectNumber
                                            name="ccExpMonth"
                                            min={1}
                                            max={12}
                                            control={control}
                                            error={errors.ccExpMonth}
                                            validate={(ccExpMonth) => User.validateExpireMonth(ccExpMonth) || "Month must be a number between 1 and 12"} //This should never show
                                            style={{ width: '30%', marginRight: 10 }}
                                        />
                                        <Text style={[globalStyles.textBlack, globalStyles.textSubtitleMedium]}>/</Text>
                                        <SelectNumber
                                            name="ccExpYear"
                                            min={2025}
                                            max={2035}
                                            control={control}
                                            error={errors.ccExpYear}
                                            validate={(ccExpYear) => User.validateExpireYear(ccExpYear) || "Year must be a number between 2025 and 2035"} //This should never show
                                            style={{ width: '30%', marginLeft: 10 }}
                                        />
                                    </View>
                                </View>

                                <FormField
                                    name="ccCVV"
                                    label="CVV"
                                    control={control}
                                    error={errors.ccCVV}
                                    validate={(ccCVV) => User.validateCVV(ccCVV) || "CVV must be 3 digits long, with no blank spaces"}
                                    inputMode="numeric"
                                />

                            </View>
                        </View>


                    </View>

                    <View style={[globalStyles.insetContainer, { marginTop: 25, marginBottom: 5 }]}>
                        <LargeButton text={(newAccount) ? "Create Account" : "Save"} onPress={handleSubmit(handleSaveChanges)} />
                    </View>

                </ScrollView>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}
