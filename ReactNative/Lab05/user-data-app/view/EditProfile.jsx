import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Image, View, Text, Button, StyleSheet } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';

// const UserProfileTextElement = ({ label, text }) => {
//     return (
//         <View style={[styles.textWithLabel]}>
//             <Text style={[styles.text, styles.label]}>
//                 {label}:
//             </Text>
//             <Text style={styles.text}>
//                 {text}
//             </Text>
//         </View>
//     )
// }

export default function EditProfile({ loggedUser }) {

    if (!loggedUser) {
        return (
            <SafeAreaView style={styles.container}>
                <Text>Loading...</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.body}>
                <Text style={[styles.text]}> Something here ...</Text>
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

    header: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBottom: 14,
    },

    body: {
        width: '100%',
        flexDirection: 'column',
        alignItems: 'center',
        paddingHorizontal: 8,
        marginTop: 20,
    },

    headerText: {
        fontSize: 24,
        fontWeight: '700',
    },

    text: {
        color: '#FFFFFF',
        paddingVertical: 2,
    },

});