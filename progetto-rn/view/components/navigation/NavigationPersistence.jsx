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
    const [isReady, setIsReady] = useState(false);
    const [initialState, setInitialState] = useState(null);

    // Restore the previous navigation state on mount
    useEffect(() => {
        const loadNavigationState = async () => {
            try {
                const savedState = await ViewModel.getNavigationStack();
                console.log("Loaded navigation state:", savedState);
                setInitialState(savedState);
            } catch (err) {
                console.warn("Failed to load navigation state:", err);
            } finally {
                setIsReady(true);
            }
        };

        loadNavigationState();
    }, []);

    // Save navigation state on navigation change
    const saveOnStateChange = async () => {
        try {
            const currentState = navigationRef.current?.getRootState();
            if (currentState) {
                await ViewModel.saveNavigationStack(currentState);
                console.log("Navigation state saved");
            }
        } catch (err) {
            console.warn("Failed to save navigation state:", err);
        }
    };

    if (!isReady) {
        return <SplashScreen />;
    }

    return (
        <NavigationContainer
            ref={navigationRef}
            initialState={initialState}
            onStateChange={saveOnStateChange}
        >
            {children}
        </NavigationContainer>
    );
};

export default NavigationPersistence;