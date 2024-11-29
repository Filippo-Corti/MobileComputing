import * as Location from 'expo-location';

export default class PositionViewModel {

    static async askForLocationPermission() {
        console.log("Asking for permission")
        const alreadyGranted = await Location.getForegroundPermissionsAsync()
        if (alreadyGranted.status === "granted") return true;
        const permissionResponse = await Location.requestForegroundPermissionsAsync()
        return permissionResponse.status === "granted"
    }

    static async getPosition() {
        return await Location.getCurrentPositionAsync()
    }

    //Returns the values for latitudeDelta and longitudeDelta so that the map
    //centered in centerPosition also shows toShowPosition
    static calculateMapDeltas(centerPosition, toShowPosition) {
        const latitudeDelta = Math.abs(centerPosition.latitude - toShowPosition.latitude) * 2 * 1.50;
        const longitudeDelta = Math.abs(centerPosition.longitude - toShowPosition.longitude) * 2 * 1.50;
        return {
            latitudeDelta: Math.max(0.001, latitudeDelta),
            longitudeDelta: Math.max(0.001, longitudeDelta),
        }
    }

    static calculateMapDeltas2Positions(centerPosition, toShowPosition1, toShowPosition2) {
        const deltas1 = this.calculateMapDeltas(centerPosition, toShowPosition1);
        const deltas2 = this.calculateMapDeltas(centerPosition, toShowPosition2);

        const latitudeDelta = parseFloat(Math.max(deltas1.latitudeDelta, deltas2.latitudeDelta).toFixed(6));
        const longitudeDelta = parseFloat(Math.max(deltas1.longitudeDelta, deltas2.longitudeDelta).toFixed(6));

        return {
            latitudeDelta: latitudeDelta,
            longitudeDelta: longitudeDelta
        }
    }

    static parseLocation(location) {
        return {
            latitude: location.lat,
            longitude: location.lng,
        }
    }

}