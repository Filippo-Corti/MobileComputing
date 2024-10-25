import React from "react";

export default function MealDetails(props) {

    const selectedMeal = props.meal

    return (
        <div>
            <p>{selectedMeal.id}</p>
            <h2>{selectedMeal.name}</h2>
            <p>{selectedMeal.shortDescription}</p>
            <p>{selectedMeal.longDescription}</p>
            <button onClick={() => props.onGoBack()}>Go Back</button>
            <button onClick={() => props.onDelete(selectedMeal.id)}>Delete Meal</button>
        </div>
    )
}