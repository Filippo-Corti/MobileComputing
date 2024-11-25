import React, { createContext, useState, useEffect } from 'react';

// Create Context
export const UserContext = createContext();

// Context Provider Component
export const UserProvider = ({ children }) => {
  const [userInformation, setUserInformation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch user information from the API
    const fetchUserInformation = async () => {
      try {
        const response = await fetch('https://api.example.com/user');
        const data = await response.json();
        setUserInformation(data); // Set the fetched user information
      } catch (error) {
        console.error('Error fetching user information:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInformation();
  }, []);

  return (
    <UserContext.Provider value={{ userInformation, loading }}>
      {children}
    </UserContext.Provider>
  );
};
