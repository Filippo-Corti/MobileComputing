import React from "react";
import { View, Text } from "react-native";

export default function UserInfo({loggedUser}) {
    
    if (!loggedUser) {
        return <Text>Loading...</Text>; // Show a loading message or spinner
    }

    console.log("Loading", loggedUser);
    return (
        <View>
            <Text>First Name: {loggedUser.fName}</Text>
            <Text>Last Name: {loggedUser.lName}</Text>
        </View>
    )
}