import * as Location from 'expo-location';

export default class PositionViewModel {

    /**
     * @param {APILocation} location 
     * @returns {Promise<string>}
     */
    static async getAddressFromLocation(location) {
        return await this.getAddressFromCoordinates(location.lat, location.lng);
    }

    /**
     * @param {number} latitude 
     * @param {number} longitude 
     * @returns {Promise<string>}
     */
    static async getAddressFromCoordinates(latitude, longitude) {
        try {
            const delAddress = await Location.reverseGeocodeAsync({ latitude: latitude, longitude: longitude });
            if (!delAddress || delAddress.length === 0) return ""

            return delAddress[0].formattedAddress;
        } catch (err) {
            console.log("Error in getAddressFromCoordinates", err)
        }
    }

    /**
     * @returns {Promise<boolean>}
     */
    static async checkLocationPermission() {
        const permission = await Location.getForegroundPermissionsAsync()
        return permission.status === "granted"
    }

    /**
     * @returns {Promise<boolean>}
     */
    static async requestPermission() {
        if (await this.checkLocationPermission()) return true;
        const permissionResponse = await Location.requestForegroundPermissionsAsync()
        return permissionResponse.status === "granted"
    }

    /**
     * @returns {Promise<APILocation>}
     */
    static async getCurrentLocation() {
        const location = await Location.getCurrentPositionAsync()
        console.log("Fetched Current Location", location);
        return {
            lat: location.coords.latitude,
            lng: location.coords.longitude,
            address: null
        }
    }

    /**
     * @param {Function} callback
     * @returns {Promise<object>} - Subscription object with a `remove` method to stop updates.
     */
    static async subscribeToLocationUpdates(callback) {
        try {
            const subscription = await Location.watchPositionAsync(
                {
                    accuracy: Location.Accuracy.High,
                    timeInterval: 10000, // Minimum time (in ms) between updates
                    distanceInterval: 10, // Minimum distance (in meters) between updates
                },
                (location) => {
                    console.log("Fetched a new Current Location", location);
                    callback({
                        lat: location.coords.latitude,
                        lng: location.coords.longitude,
                    });
                }
            );

            return subscription;
        } catch (err) {
            console.error("Error in subscribeToLocationUpdates", err);
            return null;
        }
    }

    //Returns the values for latitudeDelta and longitudeDelta so that the map
    //centered in centerPosition also shows toShowPosition
    // static calculateMapDeltas(centerPosition, toShowPosition) {
    //     const latitudeDelta = Math.abs(centerPosition.latitude - toShowPosition.latitude) * 2 * 1.50;
    //     const longitudeDelta = Math.abs(centerPosition.longitude - toShowPosition.longitude) * 2 * 1.50;
    //     return {
    //         latitudeDelta: Math.max(0.001, latitudeDelta),
    //         longitudeDelta: Math.max(0.001, longitudeDelta),
    //     }
    // }

    // static calculateMapDeltas2Positions(centerPosition, toShowPosition1, toShowPosition2) {
    //     const deltas1 = this.calculateMapDeltas(centerPosition, toShowPosition1);
    //     const deltas2 = this.calculateMapDeltas(centerPosition, toShowPosition2);

    //     const latitudeDelta = parseFloat(Math.max(deltas1.latitudeDelta, deltas2.latitudeDelta).toFixed(6));
    //     const longitudeDelta = parseFloat(Math.max(deltas1.longitudeDelta, deltas2.longitudeDelta).toFixed(6));

    //     return {
    //         latitudeDelta: latitudeDelta,
    //         longitudeDelta: longitudeDelta
    //     }
    // }

    // static parseLocation(location) {
    //     return {
    //         latitude: location.lat,
    //         longitude: location.lng,
    //     }
    // }

    // static coordinatesDistanceInKm(coords1, coords2) {
    //     function toRad(x) {
    //         return x * Math.PI / 180;
    //     }

    //     const lon1 = coords1.longitude;
    //     const lat1 = coords1.latitude;

    //     const lon2 = coords2.longitude;
    //     const lat2 = coords2.latitude;

    //     const R = 6371; // km

    //     const x1 = lat2 - lat1;
    //     const dLat = toRad(x1);
    //     const x2 = lon2 - lon1;
    //     const dLon = toRad(x2)
    //     const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    //         Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    //         Math.sin(dLon / 2) * Math.sin(dLon / 2);
    //     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    //     const d = R * c;

    //     return d;
    // }

}