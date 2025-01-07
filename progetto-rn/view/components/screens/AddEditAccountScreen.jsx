import { ScrollView, View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { globalStyles } from '../../../styles/global';
import { SafeAreaView } from 'react-native-safe-area-context';
import MyIcon, { IconNames } from '../common/icons/MyIcon';
import Separator from '../common/other/Separator';
import LargeButton from '../common/buttons/LargeButton';
import { useForm } from 'react-hook-form';
import FormField from '../common/forms/FormField';
import SelectNumber from '../common/forms/SelectNumber';
import { UserContext } from '../../context/UserContext';
import { useContext } from 'react';
import ViewModel from '../../../viewmodel/ViewModel';
import { AppStateContext } from '../../context/AppStateContext';
import colors from '../../../styles/colors';
import AccountFormViewModel from '../../../viewmodel/AccountFormViewModel';

/**
 * @param {{
*  route: { params: { newAccount: boolean } }
* }} props 
* @returns {JSX.Element}
*/
const AddEditAccountScreen = ({ 
    route = { params: { newAccount: false } }
}) => {
    
    const navigation = useNavigation();
    const newAccount = route.params.newAccount;

    const { userState, setUserState } = useContext(UserContext);
    const {appState, setError} = useContext(AppStateContext);

    const { control, handleSubmit, formState: { errors }, } = useForm((!newAccount && userState.user) ? {
        defaultValues: {
            firstName: userState.user.firstName,
            lastName: userState.user.lastName,
            cardFullName: userState.user.cardFullName,
            cardNumber: userState.user.cardNumber,
            cardExpireMonth: userState.user.cardExpireMonth,
            cardExpireYear: userState.user.cardExpireYear,
            cardCVV: userState.user.cardCVV,
        }
    } : {
        defaultValues: {
            firstName: "",
            lastName: "",
            cardFullName: "",
            cardNumber: "",
            cardExpireMonth: 1,
            cardExpireYear: 2025,
            cardCVV: "",
        }
    });

    const handleSaveChanges = async (formData) => {
        try {
            await ViewModel.updateUserDetails(formData)
            const updatedUser = await ViewModel.fetchUserDetails();
            setUserState({ 
                user: updatedUser,
                isUserRegistered: true
            });
            // @ts-ignore
            navigation.navigate("Account");
        } catch (err) {
            setError(err);
        }
    }

    if (appState.isLoading) {
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
                                name="firstName"
                                label="First Name"
                                control={control}
                                error={errors.firstName}
                                validate={(v) => AccountFormViewModel.validateFirstName(v) || "First Name should be at most 15 characters and not empty"}
                                inputProps={{ 
                                    inputMode: "text",
                                    autoCapitalize: "words"
                                }}
                            />

                            <FormField
                                name="lastName"
                                label="Last Name"
                                control={control}
                                error={errors.lastName}
                                validate={(v) => AccountFormViewModel.validateLastName(v) || "Last Name should be at most 15 characters and not empty"}
                                inputProps={{ 
                                    inputMode: "text",
                                    autoCapitalize: "words"
                                }}
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
                                name="cardFullName"
                                label="Holder Name"
                                control={control}
                                error={errors.cardFullName}
                                validate={(v) => AccountFormViewModel.validateCardFullName(v) || "Credit Card Name should be at most 31 characters and not empty"}
                                inputProps={{ 
                                    inputMode: "text",
                                    autoCapitalize: "words"
                                }}
                            />

                            <FormField
                                name="cardNumber"
                                label="Number"
                                control={control}
                                error={errors.cardNumber}
                                validate={(v) => AccountFormViewModel.validateCardNumber(v) || "Card Number should be 16 digits"}
                                inputProps={{ 
                                    inputMode: "numeric",
                                }}
                            />

                            <View style={{ marginVertical: 15 }}>
                                <Text style={[globalStyles.textDarkGray, globalStyles.textRegularNormal, { marginBottom: 10, }]}>Expiry Date </Text>
                                <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                                    <SelectNumber
                                        name="cardExpireMonth"
                                        min={1}
                                        max={12}
                                        control={control}
                                        error={errors.cardExpireMonth}
                                        validate={(v) => AccountFormViewModel.validateCardExpireMonth(v) || "Month must be a number between 1 and 12"} //This should never show
                                        style={{ width: '30%', marginRight: 10 }}
                                    />
                                    <Text style={[globalStyles.textBlack, globalStyles.textSubtitleMedium]}>/</Text>
                                    <SelectNumber
                                        name="cardExpireYear"
                                        min={2025}
                                        max={2035}
                                        control={control}
                                        error={errors.cardExpireYear}
                                        validate={(v) => AccountFormViewModel.validateCardExpireYear(v)  || "Year must be a number between 2025 and 2035"} //This should never show
                                        style={{ width: '30%', marginLeft: 10 }}
                                    />
                                </View>
                            </View>

                            <FormField
                                name="cardCVV"
                                label="CVV"
                                control={control}
                                error={errors.cardCVV}
                                validate={(v) => AccountFormViewModel.validateCardCVV(v) || "Card Number should be 3 digits"}
                                inputProps={{ 
                                    inputMode: "numeric",
                                }}
                            />

                        </View>
                    </View>


                </View>

                <View style={[globalStyles.insetContainer, { marginTop: 25, marginBottom: 5 }]}>
                    <LargeButton text={(newAccount) ? "Create Account" : "Save"} onPress={handleSubmit(handleSaveChanges)} />
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}

export default AddEditAccountScreen;
