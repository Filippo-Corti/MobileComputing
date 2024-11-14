import { 
    View, 
    Text, 
    StyleSheet, 
    Keyboard, 
    TouchableWithoutFeedback 
} from "react-native";
import MyButton from "../components/MyButton.jsx"
import FormField from "../components/FormField.jsx";
import { SafeAreaView } from 'react-native-safe-area-context';
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import PropTypes from "prop-types";
import User from "../../model/User.js";

const propTypes = {
    user: PropTypes.object,
    handleSave: PropTypes.func.isRequired,
}

export default function EditProfile({ user, handleSave }) {

    if (!user) {
        return (
            <SafeAreaView style={styles.container}>
                <Text>Loading...</Text>
            </SafeAreaView>
        );
    }

    const navigation = useNavigation();

    const { control, handleSubmit, formState: { errors }, } = useForm({
        defaultValues: {
            fName: user.fName,
            lName: user.lName,
        }
    });

    const handleSaveData = async (data) => {
        try {
            await handleSave(data);
            navigation.navigate("Profile", { reloadRequired: true });
            console.log("Successfully updated the profile data");
        } catch (err) {
            console.log("There was an error in the process of saving the new data", err);
        }

    }

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <MyButton
                    onPress={handleSubmit(handleSaveData)}
                    title="Save"
                />
            )
        })
    }, [navigation]);

    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <SafeAreaView style={styles.container} edges={["bottom", "left", "right"]}>
                <View style={styles.body}>
                    <FormField
                        name="fName"
                        label="First Name"
                        control={control}
                        error={errors.fName}
                        validate={(fName) => User.validateFirstName(fName) || "First Name must be less than 15 characters long"}
                    />
                    <FormField
                        name="lName"
                        label="Last Name"
                        control={control}
                        error={errors.lName}
                        validate={(lName) => User.validateLastName(lName) || "Last Name must be less than 15 characters long"}
                    />
                </View>
            </SafeAreaView>
        </TouchableWithoutFeedback>
    )
}

EditProfile.propTypes = propTypes;


const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#000000',
        color: '#FFFFFF',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        paddingHorizontal: 20,
        paddingVertical: 10,
    },

    body: {
        width: '100%',
        flexDirection: 'column',
        alignItems: 'flex-start',
        paddingHorizontal: 16,
        marginTop: 10,
    },

    text: {
        color: '#FFFFFF',
        paddingVertical: 2,
        fontSize: 18,
    },

});