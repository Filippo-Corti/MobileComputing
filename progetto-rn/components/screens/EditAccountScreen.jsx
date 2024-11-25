import { ScrollView, View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { globalStyles, imageBase64 } from '../../styles/global';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import MyIcon, { IconNames } from '../common/icons/MyIcon';
import Separator from '../common/other/Separator';
import InfoTextBox from '../common/other/InfoTextBox';
import LargeButton from '../common/buttons/LargeButton';
import { useForm } from 'react-hook-form';
import FormField from '../common/forms/FormField';
import SelectNumber from '../common/forms/SelectNumber';

const { height } = Dimensions.get('window');

export default ConfirmOrderScreen = ({ accountInfo }) => {

    accountInfo = {
        fName: 'John',
        lName: 'Doe',
        ccFullName: 'John Doe',
        ccNumber: '1234 5678 9012 3456',
        ccExpMonth: 12,
        ccExpYear: 2026,
        ccCCV: '123', //STRING OR DOESN'T WORK
    }

    const { control, handleSubmit, formState: { errors }, } = useForm({
        defaultValues: {
            ...accountInfo
        }
    });

    const handleSaveChanges = (formData) => {
        console.log(formData);
    }

    const navigation = useNavigation();

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
                                Your Account
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
                                    validate={() => true || "First Name must be less than 15 characters long"} //Edit to set the validation rule
                                />

                                <FormField
                                    name="lName"
                                    label="Last Name"
                                    control={control}
                                    error={errors.lName}
                                    validate={() => true || "Last Name must be less than 15 characters long"} //Edit to set the validation rule
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
                                    validate={() => true || "First Name must be less than 15 characters long"} //Edit to set the validation rule
                                />

                                <FormField
                                    name="ccNumber"
                                    label="Number"
                                    control={control}
                                    error={errors.ccNumber}
                                    validate={() => true || "Last Name must be less than 15 characters long"} //Edit to set the validation rule
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
                                            validate={() => true || "Abc"} //Edit to set the validation rule
                                            style={{ width: '30%', marginRight: 10 }}
                                        //{/* IMPORTANT: TODO - make the values part of the form using the Controller */}
                                        />
                                        <Text style={[globalStyles.textBlack, globalStyles.textSubtitleMedium]}>/</Text>
                                        <SelectNumber
                                            name="ccExpYear"
                                            min={2024}
                                            max={2034}
                                            control={control}
                                            error={errors.ccExpYear}
                                            validate={() => true || "Abc"} //Edit to set the validation rule
                                            style={{ width: '30%', marginLeft: 10 }}
                                        //{/* IMPORTANT: TODO - make the values part of the form using the Controller */}
                                        />
                                    </View>
                                </View>

                                <FormField
                                    name="ccCCV"
                                    label="CCV"
                                    control={control}
                                    error={errors.ccCCV}
                                    validate={() => true || "CCV"} //Edit to set the validation rule
                                    inputMode="numeric"
                                />

                            </View>
                        </View>


                    </View>

                    <View style={[globalStyles.insetContainer, { marginTop: 25, marginBottom: 5 }]}>
                        <LargeButton text="Save" onPress={handleSubmit(handleSaveChanges)} />
                    </View>

                </ScrollView>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({

    imageContainer: {
        width: 50,
        height: 50,
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
        left: 15,
        top: 15,
    },

    image: {
        width: '100%',
        height: '100%',
    }

});