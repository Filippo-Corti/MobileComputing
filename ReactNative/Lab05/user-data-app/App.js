import Profile from './view/Profile';
import { useNavigation } from "@react-navigation/native";
import { useState, useEffect } from 'react';
import ViewModel from './viewmodel/ViewModel';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer, useRoute } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import EditProfile from './view/EditProfile';
import {getNavHeaderOptions} from './view/NavHeader';
import { navigationRef } from './view/RootNavigation';


const USER_ID = 4; //Mine is 4

const Stack = createNativeStackNavigator();

const RootStack = ({ loggedUser, setReloadRequired }) => {

  const handleEditProfile = () => {
    navigationRef.navigate("EditProfile");
  }

  const handleUpdateProfileData = async (newUserData) => {
    setReloadRequired(true);
    return await ViewModel.updateUserData(USER_ID, newUserData);
  }


  const profileOptions = getNavHeaderOptions(false, "Welcome Back", {title: "Edit Profile", cb: handleEditProfile});
  const editOptions = getNavHeaderOptions(true, "Edit Profile", {title: "Save"});

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Profile"
        options={{
          ...profileOptions,
          animation: 'slide_from_right',
          animationDuration: 500,
        }}
      >
        {() => <Profile loggedUser={loggedUser} />}
      </Stack.Screen>
      <Stack.Screen
        name="EditProfile"
        options={{
          ...editOptions,
          animation: 'slide_from_right',
          animationDuration: 500,
        }}
      >
        {() => <EditProfile loggedUser={loggedUser} handleSave={(v) => handleUpdateProfileData(v)}/>}
      </Stack.Screen>
    </Stack.Navigator>
  );
};

export default function App() {

  const [loggedUser, setLoggedUser] = useState(null);
  const [reloadRequired, setReloadRequired] = useState(true);

  const loadUserData = () => {
    console.log("Loading data...");
    ViewModel.loadUserData(USER_ID)
      .then((userData) => {
        console.log("Retrieved data:", userData);
        setLoggedUser(userData);
      })
      .catch((err) => {
        console.error(err);
      });
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
        loggedUser={loggedUser}
        setReloadRequired={setReloadRequired}
        />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

