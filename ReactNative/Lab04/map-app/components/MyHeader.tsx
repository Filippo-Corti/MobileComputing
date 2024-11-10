import { Colors } from "@/constants/Colors";
import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import FilterIcon from "./Icons";

interface MyHeaderProps {
    title: string
}

export default function MyHeader({
    title
}: MyHeaderProps) {
    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Image
                    style={styles.headerProfileImage}
                    source={require('@/assets/images/react-logo.png')}
                />
                <Text style={styles.headerTitle}>{title}</Text>
                <View style={styles.filterImage}>
                    <FilterIcon></FilterIcon>
                </View>
            </View>
            <View>
                <Text>Some other content</Text>
            </View>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        width: '100%',
        gap: 10,
        alignItems: 'center',
        borderBottomStartRadius: 25,
        borderBottomEndRadius: 25,
        backgroundColor: Colors.light.background,
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerProfileImage: {
        width: 42,
        height: 42,
        borderRadius: 100,
    },
    filterImage: {
        width: 42,
        height: 42,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 26,
        fontWeight: '900',
        textTransform: 'uppercase',
        color: Colors.light.primary,
        textAlign: 'center',
        flexGrow: 1,
    }
});