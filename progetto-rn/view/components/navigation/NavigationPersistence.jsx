import { NavigationContainer } from "@react-navigation/native";
import React, { useState } from "react";
import { useEffect, useRef } from "react";
import { ActivityIndicator, AppState, View } from "react-native";
import ViewModel from "../../../viewmodel/ViewModel";
import MyLogo from "../common/icons/MyLogo";
import colors from "../../../styles/colors";
import SplashScreen from "../common/other/SplashScreen";

/**
 * @param {{
*  children: React.ReactNode
* }} props 
* @returns {JSX.Element}
*/
const NavigationPersistence = ({
    children
}) => {

    const navigationRef = useRef(null);
    const appState = useRef(AppState.currentState);
    const [isReady, setIsReady] = useState(false);
    const [initialState, setInitialState] = useState(null);

    // Restore the previous navigation state on first composition
    useEffect(() => {
        const loadNavigationState = async () => {
            try {
                const navStack = await ViewModel.getNavigationStack();
                console.log('Loaded navigation state:', navStack);
                setInitialState(navStack);
            } catch (err) {
                console.log('Failed to load navigation state:', err);
            } finally {
                setIsReady(true);
            }
        };

        loadNavigationState();
    }, []);

    // Save the current navigation state on ON_STOP event
    useEffect(() => {
        const subscription = AppState.addEventListener('change', async (nextAppState) => {
            if (appState.current.match(/active|foreground/) && nextAppState === 'background') { // Detects ON_STOP event
                try {
                    const currentState = navigationRef.current ? navigationRef.current.getRootState() : null;
                    if (currentState) {
                        await ViewModel.saveNavigationStack(currentState);
                        console.log('Navigation state saved:', currentState);
                    }
                } catch (err) {
                    console.log('Failed to save navigation state:', err);
                }
            }

            appState.current = nextAppState;
        });

        return () => {
            subscription.remove();
        };
    }, []);

    if (!isReady) {
        return (
            <SplashScreen />
        );
    }

    return (
        <NavigationContainer
            ref={navigationRef}
            initialState={initialState}
        >
            {children}
        </NavigationContainer>
    );

}

export default NavigationPersistence;