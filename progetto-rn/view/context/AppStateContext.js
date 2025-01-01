import React, { createContext, useState, useMemo } from 'react';

/**
 * @typedef {Object} AppStateContextValue
 * @property {LocationState} locationState 
 * @property {React.Dispatch<React.SetStateAction<LocationState>>} setLocationState 
 * @property {AppState} appState 
 * @property {React.Dispatch<React.SetStateAction<AppState>>} setAppState
*/

export const AppStateContext = createContext(
    /** @type {AppStateContextValue} */ (null)
);

/**
 * @param {{ 
 *  locationStateInit: LocationState, 
 * 	appStateInit: AppState, 
 * 	children: React.ReactNode 
 * }} props 
 * @returns {JSX.Element}
 */
export const AppStateContextProvider = ({
    locationStateInit,
    appStateInit,
    children
}) => {

    const [locationState, setLocationState] = useState(locationStateInit);
    const [appState, setAppState] = useState(appStateInit);

    
    /** @type {AppStateContextValue} */
    const contextValue = useMemo(() => ({
        locationState,
        setLocationState,
        appState,
        setAppState,
    }), [locationState, appState]);

    return (
        <AppStateContext.Provider value={contextValue}>
            {children}
        </AppStateContext.Provider>
    );
};

