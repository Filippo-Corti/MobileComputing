import * as Location from 'expo-location';

export default class PositionViewModel {

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

    static async askForLocationPermission() {
        console.log("Asking for permission")
        let canUseLocation = false;
        const grantedPermission = await Location.getForegroundPermissionsAsync()
        if (grantedPermission.status === "granted") {
            canUseLocation = true;
        } else {
            const permissionResponse = await Location.requestForegroundPermissionsAsync()
            if (permissionResponse.status === "granted") {
                canUseLocation = true;
            }
        }
        return canUseLocation;
    }

    static async getPosition() {
        return await Location.getCurrentPositionAsync()
    }

}