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
        const address = await PositionViewModel.getAddressFromCoordinates(location.coords.latitude, location.coords.longitude);
        return {
            lat: location.coords.latitude,
            lng: location.coords.longitude,
            address: address
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

    /**
     * @param {APILocation} coords1 
     * @param {APILocation} coords2 
     * @returns {number}
     */
    static coordinatesDistanceInKm(coords1, coords2) {
        function toRad(x) {
            return x * Math.PI / 180;
        }

        const lon1 = coords1.lng;
        const lat1 = coords1.lat;

        const lon2 = coords2.lng;
        const lat2 = coords2.lat;

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