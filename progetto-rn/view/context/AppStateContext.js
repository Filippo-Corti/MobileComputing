import React, { createContext, useState, useMemo } from 'react';

export const AppStateContext = createContext(null);

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


