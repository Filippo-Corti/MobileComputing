import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Image, View, Text, Button, StyleSheet } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';

const EditProfileElement = ({ label, text }) => {
    return (
        <View style={[styles.fieldWithLabel]}>
            <Text style={[styles.text, styles.fieldLabel]}>
                {label}:
            </Text>
            <Text style={[styles.text, styles.fieldText]}>
                {text}
            </Text>
        </View>
    )
}

export default function EditProfile({ loggedUser }) {

    if (!loggedUser) {
        return (
            <SafeAreaView style={styles.container}>
                <Text>Loading...</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={["bottom", "left", "right"]}>
            <View style={styles.body}>
                <EditProfileElement label={"First Name"} text={loggedUser.fName} />
                <EditProfileElement label={"Last Name"} text={loggedUser.lName} />
            </View>
        </SafeAreaView>
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

    fieldWithLabel: {
        paddingVertical: 8,
    },

    fieldLabel: {
        color: '#c3c0c7',
        fontSize: 14,
    },

    fieldText: {

    }

});