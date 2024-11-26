import React, { createContext, useState, useEffect } from 'react';

export const UserContext = createContext();

export const UserContextProvider = ({ userDataInit, orderDataInit, children }) => {

  const [userData, setUserData] = useState(userDataInit);
  const [orderData, setOrderData] = useState(orderDataInit);

  useEffect(() => {
    setUserData(userDataInit); // Update when userDataInit changes
  }, [userDataInit]);

  useEffect(() => {
    setOrderData(orderDataInit); // Update when orderDataInit changes
  }, [orderDataInit]);

  return (
    <UserContext.Provider value={{ userData, setUserData, orderData, setOrderData}}>
      {children}
    </UserContext.Provider>
  );
};


