import React, { createContext, useState, useMemo } from 'react';

export const UserContext = createContext(null);

/**
 * @param {{ 
 *  userStateInit: UserState, 
 * 	orderStateInit: LastOrderState, 
 * 	children: React.ReactNode 
 * }} props 
 * @returns {JSX.Element}
 */
export const UserContextProvider = ({
	userStateInit,
	orderStateInit,
	children
}) => {

	const [userState, setUserState] = useState(userStateInit);
	const [orderState, setOrderState] = useState(orderStateInit);

	const contextValue = useMemo(() => ({
		userState,
		setUserState,
		orderState,
		setOrderState,
	}), [userState, orderState]);

	return (
		<UserContext.Provider value={contextValue}>
			{children}
		</UserContext.Provider>
	);
};


