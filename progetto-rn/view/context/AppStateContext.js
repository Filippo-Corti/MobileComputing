import React, { createContext, useState, useMemo, useEffect } from 'react';

/**
 * @typedef {Object} AppStateContextValue
 * @property {LocationState} locationState 
 * @property {React.Dispatch<React.SetStateAction<LocationState>>} setLocationState 
 * @property {AppState} appState 
 * @property {React.Dispatch<React.SetStateAction<AppState>>} setAppState
 * @property {Function} setError
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

    const setError = (error) => {
        console.log("A new error is trying to pop up:", error);
        if (appState.error && error != null) return
        setAppState(prevState => ({
            ...prevState,
            error
        }));
    }

    useEffect(() => {
        setLocationState(locationStateInit);
    }, [locationStateInit]);

    useEffect(() => {
        setAppState(appStateInit);
    }, [appStateInit]);

    
    /** @type {AppStateContextValue} */
    const contextValue = useMemo(() => ({
        locationState,
        setLocationState,
        appState,
        setAppState,
        setError
    }), [locationState, appState]);

    return (
        <AppStateContext.Provider value={contextValue}>
            {children}
        </AppStateContext.Provider>
    );
};

