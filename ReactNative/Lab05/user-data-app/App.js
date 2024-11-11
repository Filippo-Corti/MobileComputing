import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import UserInfo from './view/UserInfo';
import { useState, useEffect } from 'react';
import ViewModel from './viewmodel/ViewModel';

export default function App() {

  const USER_ID = 3; //Mine is 28

  const [loggedUser, setLoggedUser] = useState(null);

  useEffect(() => {
    console.log("Loading data...");
    ViewModel.loadUserData(USER_ID)
      .then((userData) => {
        console.log("Retrieved data:", userData);
        setLoggedUser(userData);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <UserInfo
        loggedUser={loggedUser}
      />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
