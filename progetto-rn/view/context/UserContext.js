import React, { createContext, useState, useEffect } from 'react';

export const UserContext = createContext();

export const UserContextProvider = ({ contextData, children }) => {
  return (
    <UserContext.Provider value={{ contextData }}>
      {children}
    </UserContext.Provider>
  );
};


