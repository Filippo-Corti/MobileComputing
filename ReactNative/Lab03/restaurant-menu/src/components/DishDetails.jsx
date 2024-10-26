import React from "react";

export default function DishDetails({dish, handleGoBack, handleDelete}) {

    return (
        <div>
            <p>{dish.id}</p>
            <h2>{dish.name}</h2>
            <p>{dish.shortDescription}</p>
            <p>{dish.longDescription}</p>
            <button onClick={() => handleGoBack()}>Go Back</button>
            <button onClick={() => handleDelete(dish.id)}>Delete Meal</button>
        </div>
    )
}