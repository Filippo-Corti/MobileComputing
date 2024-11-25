import React, { createContext, useState } from 'react';

export const UserContext = createContext();

export const UserContextProvider = ({ userDataInit, isRegisteredInit, children }) => {

  const [userData, setUserData] = useState(userDataInit);
  const [isRegistered, setIsRegistered] = useState(isRegisteredInit);

  return (
    <UserContext.Provider value={{ userData, setUserData, isRegistered, setIsRegistered }}>
      {children}
    </UserContext.Provider>
  );
};


