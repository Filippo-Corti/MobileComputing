import React from "react";
import DishListItem from "./DishListItem";

export default function DishList({ dishes, handleShowDetails }) {

    return (
        <ul>
            {dishes.map(dish => (
                <DishListItem
                    key={dish.id}
                    dishData={dish}
                    handleShowDetails={handleShowDetails} />
            ))}
        </ul>
    )
}