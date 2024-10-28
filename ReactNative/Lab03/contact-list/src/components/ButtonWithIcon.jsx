import React from "react";

export default function ButtonWithIcon({ Icon, size, color, handleClick, text }) {

    if (!handleClick) 
        handleClick = () => {}


    const buttonStyle = {
        "backgroundColor": "transparent",
        "border": "none",
        "display": "flex",
        "flexDirection": "column",
        "gap": "0.2rem",
        "color": color,
        "alignItems": "center",
    }

    return (
        <button style={buttonStyle} onClick={() => handleClick()}>
            <Icon
                size={size}
                color={color}
            />
            <p style={{"padding": "0", "margin": "0"}}>{text}</p>
        </button>
    )

}