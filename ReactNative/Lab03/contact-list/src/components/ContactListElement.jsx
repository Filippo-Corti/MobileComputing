import '../css/ContactListElement.css';
import React from 'react';
import ButtonWithIcon from './ButtonWithIcon';
import {MenuIcon, PlusIcon, SearchIcon } from './Icons';


export default function ContactListElement({contacts, handleContactDetails}) {

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
        </div>
   );
}