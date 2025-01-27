import { useFonts } from 'expo-font';
import { fonts } from './styles/global';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeStack from './view/components/navigation/HomeStack';
import LastOrderScreen from './view/components/screens/LastOrderScreen';
import AccountStack from './view/components/navigation/AccountStack';
import MyTabBar from './view/components/navigation/MyTabBar';
import ViewModel from './viewmodel/ViewModel';
import { useEffect, useState } from 'react';
import { UserContextProvider } from './view/context/UserContext';
import PositionViewModel from './viewmodel/PositionViewModel';
import { AppStateContextProvider } from './view/context/AppStateContext';
import MyError from './model/types/MyError';
import NavigationPersistence from './view/components/navigation/NavigationPersistence';
import SplashScreen from './view/components/common/other/SplashScreen';

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
		error: null,
		reloadFavourites: false,
	});

	const initalizeUserContext = async () => {
		const isRegistered = await ViewModel.isRegistered();
		console.log("User is registered:", isRegistered);
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
			if (locationState.hasCheckedPermission) return;

			// Initialize the location context
			await checkLocationPermission();

			// Initialize the user context
			await ViewModel.getUserSession();
			await initalizeUserContext();

			setAppState(prevState => ({
				...prevState,
				isLoading: false
			}));
		};
		
		initializeAndFetch();
	}, [locationState.hasCheckedPermission]);


	if (appState.isLoading || !fontsLoaded) {
		return (
			<SplashScreen />
		);
	}

	return (
		<AppStateContextProvider locationStateInit={locationState} appStateInit={appState}>
			<UserContextProvider userStateInit={userState} orderStateInit={lastOrderState}>
				<NavigationPersistence>
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

				</NavigationPersistence>
			</UserContextProvider>
		</AppStateContextProvider>
	);
}

