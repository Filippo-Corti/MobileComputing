import React from "react";
import DishListItem from "./DishListItem";
import { View, Text, FlatList } from "react-native";
import styles from "../style";

export default function DishList({ dishes, handleShowDetails }) {

    return (
        <View>
            <Text style={styles.pageTitle}>Ricettario</Text>
            <FlatList
                data={dishes}
                renderItem={(dish) => <DishListItem dishData={dish.item} handleShowDetails={handleShowDetails} />}
                keyExtractor={(dish) => dish.id}
            />
        </View>
    )
}