import '../css/ContactList.css';
import React from 'react';
import ButtonWithIcon from './ButtonWithIcon';
import { MenuIcon, PlusIcon, SearchIcon } from './Icons';
import ContactListElement from './ContactListElement';


export default function ContactList({ contacts, handleContactDetails }) {

    return (
        <div>
            <h1 className="Title">Rubrica</h1>
            <div className="Action_icons">
                <ButtonWithIcon
                    Icon={PlusIcon}
                    size="22"
                    color="#45A9BB"
                />
                <ButtonWithIcon
                    Icon={SearchIcon}
                    size="22"
                    color="#45A9BB"
                />
                <ButtonWithIcon
                    Icon={MenuIcon}
                    size="22"
                    color="#45A9BB"
                />
            </div>
            <div className="Contacts_list">
                <ul style={{"listStyle": 'none', 'padding': '0', 'margin': '0'}}>
                    {contacts.map((contact) => 
                        <ContactListElement
                            key={contact.id}
                            contact={contact}
                            handleContactDetails={handleContactDetails}
                        />)}
                </ul>
            </div>
        </div>
    );
}