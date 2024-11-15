import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import CommunicationController from './model/CommunicationController';
import DBController from './model/DBController';
import AsyncStorageManager from './model/AsyncStorageManager';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ViewModel from './viewmodel/ViewModel';

export default function App() {

  const viewModel = new ViewModel();

  const defaultAppState = {
    firstLaunch: false,
    sid: null,
    uid: null,
  }

  const [appState, setAppState] = useState(defaultAppState);

  const updateAppState = (newState) => {
    setAppState({
      ...appState,
      ...newState
    })
  } 

 
  //AsyncStorage.clear();
  const startApp = async () => {
    const appStateData = await viewModel.fetchAppStateData();
    updateAppState(appStateData);
    await viewModel.fetchTestMenu(12);
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
});
