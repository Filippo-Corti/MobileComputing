import * as Location from 'expo-location';

export default class ViewModelPosition {

    static async askForLocationPermission() {
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


