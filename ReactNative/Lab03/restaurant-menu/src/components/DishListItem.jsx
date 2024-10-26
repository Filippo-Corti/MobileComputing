import React from "react";

export default function MealsListItem({dishData, handleShowDetails}) {

    return (
        <li>
            <h3>{dishData.name}</h3>
            <p>{dishData.shortDescription}</p>
            <button onClick={() => handleShowDetails(dishData.id)}>Details</button>
        </li>
    )

}