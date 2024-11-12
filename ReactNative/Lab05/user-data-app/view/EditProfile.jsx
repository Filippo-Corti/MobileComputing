import { useNavigation } from "@react-navigation/native";
import React, {useEffect} from "react";
import { Image, View, Text, Button, StyleSheet, Keyboard, TouchableWithoutFeedback} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import FormField from "./FormField.jsx";
import { useForm } from "react-hook-form";
import MyButton from "./MyButton"

export default function EditProfile({ loggedUser, handleSave }) {

    if (!loggedUser) {
        return (
            <SafeAreaView style={styles.container}>
                <Text>Loading...</Text>
            </SafeAreaView>
        );
    }

    const navigation = useNavigation();

    const {control, handleSubmit, formState: { errors },} = useForm({
        defaultValues: {
            fName: loggedUser.fName,
            lName: loggedUser.lName,
      }
    });

    const handleSaveData = async (data) => {
        try {
            await handleSave(data);
            navigation.goBack();
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
                    />
                    <FormField 
                        name="lName"
                        label="Last Name"
                        control={control}
                        error={errors.lName}
                    />
                </View>
            </SafeAreaView>
        </TouchableWithoutFeedback>
    )
}


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