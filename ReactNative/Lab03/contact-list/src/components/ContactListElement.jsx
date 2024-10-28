import '../css/ContactListElement.css';
import React from "react";

export default function ContactListElement({contact, handleContactDetails}) {

    return (
        <li className="Contact_container" onClick={() => handleContactDetails(contact)}>
            <div className="Contact_icon">

            </div>
            <div className="Contact_details">
                <span>{contact.getFullName()}</span>
            </div>
        </li>
    )

}