import '../css/ContactDetail.css';
import React from "react";
import ButtonWithIcon from './ButtonWithIcon';
import { BackArrowIcon, DeleteIcon, EditIcon } from './Icons';

export default function ContactDetail({ contact, handleGoBack }) {

    return (
        <div className="Contact_page">
            <div className="Back_button">
                <ButtonWithIcon
                    Icon={BackArrowIcon}
                    size="26"
                    color="#45A9BB"
                    handleClick={() => handleGoBack()}
                />
            </div>
            <div className="Contact_detail">
                <div className="Contact_logo" style={{ "backgroundColor": "white" }}></div>
                <h3>{contact.getFullName()}</h3>
                <div className="Cellphone_container">
                    <span className="Cellphone_tag">Cellulare</span>
                    <span className="Cellphone_data">{contact.getFullPhoneNumber()}</span>
                </div>
            </div>
            <div className="Bottom_menu">
                <ButtonWithIcon
                    Icon={DeleteIcon}
                    size="26"
                    color="#45A9BB"
                    text="Delete"
                />
                <ButtonWithIcon
                    Icon={EditIcon}
                    size="26"
                    color="#45A9BB"
                    text="Edit"
                />
            </div>
        </div>
    )

}