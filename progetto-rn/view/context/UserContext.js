import React, { createContext, useState } from 'react';

export const UserContext = createContext();

export const UserContextProvider = ({ userDataInit, children }) => {

  const [userData, setUserData] = useState(userDataInit);

  return (
    <UserContext.Provider value={{ userData, setUserData,}}>
      {children}
    </UserContext.Provider>
  );
};


