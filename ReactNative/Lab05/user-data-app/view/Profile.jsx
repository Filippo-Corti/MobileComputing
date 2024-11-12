import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Image, View, Text, Button, StyleSheet } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Profile({ loggedUser }) {
    
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
                <Image
                    style={styles.profileImage}
                    source={require('../assets/default-avatar.jpg')}
                />
                <Text style={[styles.text, styles.profileName]}>
                    {loggedUser.fName} {loggedUser.lName}
                </Text>
            </View>
        </SafeAreaView>
    )
}


const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#000000',
        color: '#FFFFFF',
        paddingHorizontal: 20,
        paddingVertical: 12,
    },

    body: {
        width: '100%',
        flexDirection: 'column',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 14,
    },

    text: {
        color: '#FFFFFF',
        paddingVertical: 2,
    },

    profileName: {
        paddingTop: 5,
        fontSize: 24,
        fontWeight: '600',
    },

    profileImage: {
        width: 150,
        height: 150,
        borderRadius: 75,
    },

});