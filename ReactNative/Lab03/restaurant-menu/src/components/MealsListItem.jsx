import React from "react";

export default function MealsListItem(props) {

    return (
        <li>
            <h3>{props.data.name}</h3>
            <p>{props.data.shortDescription}</p>
            <button onClick={() => props.onDetail(props.data.id)}>Details</button>
        </li>
    )

}