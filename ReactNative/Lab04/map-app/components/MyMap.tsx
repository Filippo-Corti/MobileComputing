import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

export default function MyMap() {
    const [location, setLocation] = useState({ latitude: 37.78825, longitude: -122.4324 });

    useEffect(() => {
        const getLocationPermission = async () => {
            // Request location permissions
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status === 'granted') {
                // Get the current location
                try {
                    const currentLocation = await Location.getCurrentPositionAsync({});
                    setLocation(currentLocation.coords);
                } catch (error) {
                    console.log(error);
                }
            } else {
                console.log("Location permission not granted");
            }
        };

        getLocationPermission();
    }, []);

    return (
        <View style={styles.container} >
            <MapView
                style={styles.map}
                showsUserLocation={true}
                initialRegion={{
                    latitude: location?.latitude,
                    longitude: location?.longitude,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}>
                <Marker coordinate={{ latitude: 37.78825, longitude: -122.4324 }}>
                </Marker>
            </MapView>
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