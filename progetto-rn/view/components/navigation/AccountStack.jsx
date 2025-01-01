import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AccountScreen from '../screens/AccountScreen';
import EditAccountScreen from '../screens/AddEditAccountScreen';

const Stack = createNativeStackNavigator();

const AccountStack = ({ }) => {

    return (
        <Stack.Navigator
          id={undefined}
          screenOptions={{
            headerShown: false
          }}
        >
          <Stack.Screen name="Account" component={AccountScreen} />
          <Stack.Screen name="EditAccount" component={EditAccountScreen} />
        </Stack.Navigator>
      );
}

export default AccountStack;