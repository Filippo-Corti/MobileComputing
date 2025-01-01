import { View, ActivityIndicator } from 'react-native';
import { useFonts } from 'expo-font';
import { fonts } from './styles/global';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import HomeStack from './view/components/navigation/HomeStack';
import LastOrderScreen from './view/components/screens/LastOrderScreen';
import AccountStack from './view/components/navigation/AccountStack';
import MyTabBar from './view/components/navigation/MyTabBar';
import MyLogo from './view/components/common/icons/MyLogo';
import colors from './styles/colors';
import ViewModel from './viewmodel/ViewModel';
import { useEffect, useState } from 'react';
import { UserContextProvider } from './view/context/UserContext';
import PositionViewModel from './viewmodel/PositionViewModel';
import { AppStateContextProvider } from './view/context/AppStateContext';
import MyError from './model/types/MyError';

const Tab = createBottomTabNavigator();

export default function App() {


	const [fontsLoaded] = useFonts({ // @ts-ignore
		[fonts.regular]: require('./assets/fonts/UberMoveText-Regular.otf'), // @ts-ignore
		[fonts.medium]: require('./assets/fonts/UberMoveText-Medium.otf'), // @ts-ignore
		[fonts.bold]: require('./assets/fonts/UberMoveText-Bold.otf'), // @ts-ignore
		[fonts.logo]: require('./assets/fonts/Geologica-Medium.ttf'),
	});

	const [userState, setUserState] = useState({ // UserState
		user: null,
		isUserRegistered: false
	});
	const [lastOrderState, setLastOrderState] = useState({ // LastOrderState
		lastOrder: null,
		lastOrderMenu: null
	});
	const [locationState, setLocationState] = useState({ // LocationState
		lastKnownLocation: null,
		isLocationAllowed: false,
		hasCheckedPermission: false
	});
	const [appState, setAppState] = useState({ // AppState
		isLoading: true,
		isFirstLaunch: true,
		reloadMenus: false,
		error: null
	});

	const initalizeUserContext = async () => {
		const isRegistered = await ViewModel.isRegistered();
		const user = (isRegistered)
			? await ViewModel.fetchUserDetails()
			: null;

		setUserState({
			user: user,
			isUserRegistered: isRegistered
		});
	}

	const checkLocationPermission = async () => {
		const locationAllowed = await PositionViewModel.checkLocationPermission();
		if (locationAllowed) {
			// Get the current location
			const newLocation = await PositionViewModel.getCurrentLocation();
			setLocationState(prevState => ({
				...prevState,
				hasCheckedPermission: true,
				lastKnownLocation: newLocation,
				isLocationAllowed: true,
			}));
			// Subscribe to location updates
			PositionViewModel.subscribeToLocationUpdates((location) => {
				setLocationState(prevState => ({
					...prevState,
					lastKnownLocation: location,
				}));
			});
		} else {
			setAppState(prevState => ({
				...prevState,
				error: new MyError(
					"POSITION_UNALLOWED",
					"We need your Location",
					"This app requires your location to work properly. \nIn case you deny the permission, some features may not work as expected.",
					"I'll do it"
				),
			}));
			setLocationState(prevState => ({
				...prevState,
				hasCheckedPermission: true
			}));
		}
	}

	useEffect(() => {
		const initializeAndFetch = async () => {
			await ViewModel.getUserSession();

			await initalizeUserContext();
		};

		initializeAndFetch();

	}, []);

	useEffect(() => {
		const checkLocationAsync = async () => {
			if (locationState.hasCheckedPermission) return;
			await checkLocationPermission();
			setAppState(prevState => ({
				...prevState,
				isLoading: false
			}));
		};
		checkLocationAsync();
	}, [locationState.hasCheckedPermission]);


	if (appState.isLoading || !fontsLoaded) {
		return (
			<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
				<MyLogo />
				<ActivityIndicator size="large" color={colors.primary} />
			</View>
		);
	}

	return (
		<AppStateContextProvider locationStateInit={locationState} appStateInit={appState}>
			<UserContextProvider userStateInit={userState} orderStateInit={lastOrderState}>
				<NavigationContainer>
					<Tab.Navigator
						id={undefined}
						screenOptions={{
							headerShown: false
						}}
						tabBar={(props) => <MyTabBar {...props} />}
					>
						<Tab.Screen name="HomeStack" component={HomeStack} />
						<Tab.Screen name="LastOrder" component={LastOrderScreen} />
						<Tab.Screen name="AccountStack" component={AccountStack} />
					</Tab.Navigator>

				</NavigationContainer>
			</UserContextProvider>
		</AppStateContextProvider>
	);
}

