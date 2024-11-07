import React from "react";
import { View, Text, Button } from "react-native"
import styles from "../style";

export default function DishDetails({ dish, handleGoBack, handleDelete }) {

    return (
        <View>
            <Text style={styles.pageTitle}>
                {dish.name} {"\n"}
                <Text style={{
                    fontSize: 15,
                    color: 'grey',
                }}>Id: {dish.id}</Text>
            </Text>
            <Text style={{
                paddingVertical: 12,
                paddingHorizontal: 12,
                fontSize: 15,
                fontWeight: 'bold'
            }}>{dish.shortDescription}</Text>

            <Text style={{
                paddingVertical: 12,
                paddingHorizontal: 12,
                fontSize: 15,
            }}>{dish.longDescription}</Text>
            <View style={{
                padding: 15,
                flexDirection: 'row',
                gap: 25,
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                <Button
                    onPress={() => handleGoBack()}
                    title="Go Back"
                />
                <Button 
                    color="red"
                    onPress={() => handleDelete(dish.id)}
                    title="Delete Meal"
                />
            </View>
        </View>
    )
}