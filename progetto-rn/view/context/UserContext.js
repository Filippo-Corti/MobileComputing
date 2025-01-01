import React, { createContext, useState, useMemo } from 'react';

/**
 * @typedef {Object} UserContextValue
 * @property {UserState} userState
 * @property {React.Dispatch<React.SetStateAction<UserState>>} setUserState 
 * @property {LastOrderState} orderState 
 * @property {React.Dispatch<React.SetStateAction<LastOrderState>>} setOrderState
*/

export const UserContext = createContext(
    /** @type {UserContextValue} */(null)
);

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

	/** @type {UserContextValue} */
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


