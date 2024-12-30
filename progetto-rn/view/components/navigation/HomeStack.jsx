import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import MenuDetailsScreen from '../screens/MenuDetailsScreen';
import ConfirmOrderScreen from '../screens/ConfirmOrderScreen';

const Stack = createNativeStackNavigator();

const HomeStack = ({ }) => {

	return (
		<Stack.Navigator
			id={undefined}
			screenOptions={{
				headerShown: false,
			}}
		>
			<Stack.Screen name="Home" component={HomeScreen} />
			<Stack.Screen name="MenuDetails" component={MenuDetailsScreen} />
			<Stack.Screen name="ConfirmOrder" component={ConfirmOrderScreen} />
		</Stack.Navigator>
	);
}

export default HomeStack;