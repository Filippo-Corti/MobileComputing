import { View, ActivityIndicator } from 'react-native';
import { useFonts } from 'expo-font';
import { fonts } from './styles/global';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import HomeStack from './components/navigation/HomeStack';
import LastOrderScreen from './components/screens/LastOrderScreen';
import AccountStack from './components/navigation/AccountStack';
import MyTabBar from './components/navigation/MyTabBar';
import MyLogo from './components/common/icons/MyLogo';
import colors from './styles/colors';

const Tab = createBottomTabNavigator();

export default function App() {

  const [fontsLoaded] = useFonts({
    [fonts.regular]: require('./assets/fonts/UberMoveText-Regular.otf'),
    [fonts.medium]: require('./assets/fonts/UberMoveText-Medium.otf'),
    [fonts.bold]: require('./assets/fonts/UberMoveText-Bold.otf'),
    [fonts.logo]: require('./assets/fonts/Geologica-Medium.ttf'),
  });


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

