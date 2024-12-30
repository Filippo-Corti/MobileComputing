import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import MyIcon, { IconNames } from '../common/icons/MyIcon';
import { globalStyles } from '../../../styles/global';
import colors from '../../../styles/colors';
import React, { useContext } from 'react';
import { AppStateContext, startTrackingLocation } from '../../context/AppStateContext';
import BottomModal, { handleErrorByType } from '../common/other/BottomModal';
import PositionViewModel from '../../../viewmodel/PositionViewModel';

/**
 * @param {import('@react-navigation/bottom-tabs').BottomTabBarProps} props 
 * @returns {JSX.Element}
 */
const MyTabBar = ({
    state,
    descriptors,
    navigation
}) => {

    const iconNames = [IconNames.HOME, IconNames.SHOPPING_BAG, IconNames.USER];
    const iconSizes = [32, 28, 28]
    const texts = ["Home", "Last Order", "Account"]

    const { appState, setLocationState } = useContext(AppStateContext);

    return (
        <>

            {appState.error &&
                <BottomModal
                    title={appState.error.title}
                    text={appState.error.message}
                    confirmText={appState.error.actionText}
                    dismissText={appState.error.dismissText}
                    onConfirm={() => {
                        handleErrorByType(
                            appState.error,
                            (screen) => {
                                navigation.navigate(screen)
                            },
                            () => {
                                PositionViewModel.requestPermission().then (
                                    (permissionOk) => {
                                        if (permissionOk)
                                            startTrackingLocation((location) => {
                                                setLocationState(prevState => ({
                                                    ...prevState,
                                                    lastKnownLocation: location,
                                                    isLocationAllowed: true,
                                                }));
                                            });
                                    }
                                )
                            }
                        )
                    }
                    }
                />
            }

            <View style={{ flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 14 }}>
                {state.routes.map((route, index) => {
                    const { options } = descriptors[route.key];

                    const isFocused = state.index === index;

                    const onPress = () => {
                        const event = navigation.emit({
                            type: 'tabPress',
                            target: route.key,
                            canPreventDefault: true,
                        });

                        if (!isFocused && !event.defaultPrevented) {
                            navigation.navigate(route.name);
                        }
                    };

                    const onLongPress = () => {
                        navigation.emit({
                            type: 'tabLongPress',
                            target: route.key,
                        });
                    };

                    return (
                        <TouchableOpacity
                            accessibilityRole="button"
                            accessibilityState={isFocused ? { selected: true } : {}}
                            accessibilityLabel={options.tabBarAccessibilityLabel}
                            onPress={onPress}
                            onLongPress={onLongPress}
                            style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1 }}
                            key={index}
                        >
                            <MyIcon name={iconNames[index]} size={iconSizes[index]} color={isFocused ? colors.black : colors.gray} />
                            <Text style={[isFocused ? globalStyles.textBlack : globalStyles.textGray, globalStyles.textVerySmallRegular]}>{texts[index]}</Text>
                        </TouchableOpacity>
                    );
                })}


            </View>
        </>
    );

}

export default MyTabBar;