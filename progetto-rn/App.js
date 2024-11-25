import { View, ActivityIndicator } from 'react-native';
import { useFonts } from 'expo-font';
import { fonts } from './styles/global';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import HomeStack from './view/components/navigation/HomeStack';
import LastOrderScreen from './view/components/screens/LastOrderScreen';
import AccountStack from './view/components/navigation/AccountStack';
import MyTabBar from './view/components/navigation/MyTabBar';
import MyLogo from './view/components/common/icons/MyLogo';
import colors from './styles/colors';
import ViewModel from './viewmodel/ViewModel';
import { useEffect, useState } from 'react';

const Tab = createBottomTabNavigator();

export default function App() {

  const [fontsLoaded] = useFonts({
    [fonts.regular]: require('./assets/fonts/UberMoveText-Regular.otf'),
    [fonts.medium]: require('./assets/fonts/UberMoveText-Medium.otf'),
    [fonts.bold]: require('./assets/fonts/UberMoveText-Bold.otf'),
    [fonts.logo]: require('./assets/fonts/Geologica-Medium.ttf'),
  });


  const [viewModel, setViewModel] = useState(null);

  const initViewModel = async () => {
    try {
      const newViewModel = ViewModel.getViewModel();
      setViewModel(newViewModel);
    } catch (err) {
      console.error("Error loading the View Model:", err);
    }
  }

  const fetchUserData = async () => {
    try {
      const [userData, isRegistered] = await viewModel.fetchLaunchInformation();
      console.log("FetchUserData:", userData, isRegistered);
    } catch (err) {
      console.error("Error loading the Menu Data:", err);
    }
  }

  useEffect(() => {
    const initializeAndFetch = async () => {
      if (!viewModel) {
        await initViewModel();
      }
      if (viewModel) {
        await fetchUserData();
      }
    };

    initializeAndFetch();

  }, [viewModel]);

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <MyLogo />
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Tab.Navigator
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
  );
}

