import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AccountScreen from '../screens/AccountScreen';
import EditAccountScreen from '../screens/EditAccountScreen';

const Stack = createNativeStackNavigator();

export default AccountStack = ({}) => {

    return (
        <Stack.Navigator
            screenOptions={{
            headerShown: false
          }}
        >
          <Stack.Screen name="Account" component={AccountScreen} />
          <Stack.Screen name="EditAccount" component={EditAccountScreen} />
        </Stack.Navigator>
      );
}