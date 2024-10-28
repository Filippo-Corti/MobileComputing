import './css/App.css';
import ContactList from './models/ContactList';
import React, { useState } from 'react';
import Contact from './models/Contact';
import ContactListComponent from './components/ContactList';

function App() {

  const [page, setPage] = useState("list")
  const [contactList, _] = useState(new ContactList())
  const [selectedContact, setSelectedContact] = useState(null)

  for (let i = 0; i < 5; i++) {
    const c = new Contact("Nome" + i, "Cognome" + i, "39", "320959655" + i)
    contactList.addContact(c)
  }

  const handleContactDetails = (contact) => {
    setSelectedContact(contact)
    setPage("detail")
  }

  switch (page) {
    case "list":
      return (
        <ContactListComponent
          contacts={contactList.contacts}
          handleContactDetails={handleContactDetails}
        />
      )
    case "detail":
      return (
        <div></div>
      )
    default:
      return (
        <section>
          <h1>Error - Page Not Found</h1>
        </section>
      )
  }
}

export default App;
