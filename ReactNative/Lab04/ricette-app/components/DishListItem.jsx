import React from "react";
import { View, Text, Button } from "react-native";
import styles from "../style";

export default function MealsListItem({ dishData, handleShowDetails }) {

    return (
        <View style={{
            flex: 1,
            padding: 20,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            borderBottomWidth: 1,
            borderColor: 'grey'
        }}>
            <View style={{
                minWidth: '60%',
            }}>
                <Text style={styles.title}>{dishData.name}</Text>
                <Text>{dishData.shortDescription}</Text>
            </View>
            <View style={[
                styles.buttonContainer,
                {
                    minWidth: '25%',
                }]}>
                <Button style={styles.smallButton}
                    onPress={() => handleShowDetails(dishData.id)}
                    title="Details"
                />
            </View>

        </View>
    )

}