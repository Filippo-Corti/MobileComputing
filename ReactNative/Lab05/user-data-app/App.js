import {
  useState,
  useEffect
} from 'react';
import ViewModel from './viewmodel/ViewModel';
import RootStack from './view/navigation/RootStack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { navigationRef } from './view/navigation/RootNavigation';

const USER_ID = 4; //Mine is 4

export default App = () => {

  const [loggedUser, setLoggedUser] = useState(null);
  const [reloadRequired, setReloadRequired] = useState(true);

  const loadUserData = async () => {
    try {
      console.log("Loading data...");
      const userData = await ViewModel.loadUserData(USER_ID);
      console.log("Retrieved data:", userData);
      setLoggedUser(userData);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    if (reloadRequired) {
      loadUserData();
      setReloadRequired(false);
    }
  }, [reloadRequired]);


  return (
    <SafeAreaProvider>
      <NavigationContainer ref={navigationRef}>
        <RootStack
          user={loggedUser}
          setReloadRequired={setReloadRequired}
        />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

