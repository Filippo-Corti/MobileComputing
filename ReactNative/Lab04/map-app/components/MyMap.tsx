import React from "react";
import { View, StyleSheet } from "react-native";
import MapView from 'react-native-maps';

export default function MyMap() {
    return (
        <View style={styles.container} >
            <MapView
                style={styles.map}
                showsUserLocation={true}
                
            />
        </View >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        backgroundColor: 'red',
        zIndex: -1,
    },
    map: {
        transform: [{ translateY: -20 }],
        width: '100%',
        height: '110%',
        overflow: 'hidden',
    },
});