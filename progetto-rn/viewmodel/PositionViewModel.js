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

    static async getAddressFromCoordinates(coordinates) {
        try {
            const delAddress = await Location.reverseGeocodeAsync(coordinates);
            console.log(delAddress.length)
            return delAddress[0].formattedAddress;
        } catch (err) {
            throw new Error("Error using Reverse Geocoding service: ", err)
        }
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

    static coordinatesDistanceInKm(coords1, coords2) {
        function toRad(x) {
            return x * Math.PI / 180;
        }

        const lon1 = coords1.longitude;
        const lat1 = coords1.latitude;

        const lon2 = coords2.longitude;
        const lat2 = coords2.latitude;

        const R = 6371; // km

        const x1 = lat2 - lat1;
        const dLat = toRad(x1);
        const x2 = lon2 - lon1;
        const dLon = toRad(x2)
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const d = R * c;

        return d;
    }

}