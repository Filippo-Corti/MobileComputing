import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import ViewModel from './viewmodel/ViewModel';

export default function App() {

  console.log("--------------------------");
  const viewModel = new ViewModel();

  const defaultAppState = {
    firstLaunch: false,
    sid: null,
    uid: null,
    imageURL: null,
    imageFetchText: null,
  }

  const [appState, setAppState] = useState(defaultAppState);

  const updateAppState = (newState) => {
    setAppState((prevState) => ({
      ...prevState,
      ...newState
    }));
  } 

 
  //AsyncStorage.clear();
  const startApp = async () => {
    const appStateData = await viewModel.fetchAppStateData();
    updateAppState(appStateData);
    const imageURL = await viewModel.fetchTestMenu(1);
    updateAppState(imageURL);
    console.log("Menu Fetch ENDED");
  }

  useEffect(() => {
    startApp();
  }, []);

  if (appState.firstLaunch) {
    return (
      <View style={styles.container}>
        <StatusBar style="auto" />
        <Text>Primo avvio completato</Text>
        <Text>SID: {appState.sid?.substring(0, 10)}...</Text>
        <Text>UID: {appState.uid}</Text>
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        <Text>Secondo avvio.</Text>
        <Text>SID: {appState.sid?.substring(0, 10)}...</Text>
        <Text>UID: {appState.uid}</Text>
        <Image source={{uri: appState.imageURL}} style={styles.image}></Image>
        <Text>{appState.imageFetchText}</Text>
        <StatusBar style="auto" />
      </View>
    );

  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  image: {
    width: 154,
    height: 154,
  },

});
