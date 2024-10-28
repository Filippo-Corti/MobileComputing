import './css/App.css';
import ContactList from './models/ContactList';
import React, { useEffect, useState } from 'react';
import Contact from './models/Contact';
import ContactListComponent from './components/ContactList';
import ContactDetail from './components/ContactDetail';

function App() {

  const [page, setPage] = useState("list")
  const [contactList, setContactList] = useState(new ContactList())
  const [selectedContact, setSelectedContact] = useState(null)

  useEffect(() => {
    const newContactList = new ContactList();
    for (let i = 0; i < 5; i++) {
      const c = new Contact("Nome" + i, "Cognome" + i, "39", "320959655" + i);
      newContactList.addContact(c);
    }
    setContactList(newContactList);
  }, []);

  const handleContactDetails = (contact) => {
    setSelectedContact(contact)
    setPage("detail")
  }

  const handleGoBack = () => {
    setSelectedContact(null)
    setPage("list")
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
        <ContactDetail
          contact={selectedContact}
          handleGoBack={handleGoBack}
        />
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
