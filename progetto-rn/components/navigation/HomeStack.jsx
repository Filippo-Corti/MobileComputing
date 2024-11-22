import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import MenuDetailsScreen from '../screens/MenuDetailsScreen';
import ConfirmOrderScreen from '../screens/ConfirmOrderScreen';

const Stack = createNativeStackNavigator();

export default HomeStack = ({}) => {

    return (
        <Stack.Navigator
            screenOptions={{
            headerShown: false,
          }}        
        >
          <Stack.Screen name="MenuDetails" component={MenuDetailsScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="ConfirmOrder" component={ConfirmOrderScreen} />
        </Stack.Navigator>
      );
}