import React from "react";

export default function ButtonWithIcon({ Icon, size, color, handleClick }) {

    if (!handleClick) 
        handleClick = () => {}

    const buttonStyle = {
        "background-color": "transparent",
        "border": "none",
    }

    return (
        <button style={buttonStyle} onClick={() => handleClick()}>
            <Icon
                size={size}
                color={color}
            />
        </button>
    )

}