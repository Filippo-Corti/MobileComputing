import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import ViewModel from './viewmodel/ViewModel';

export default function App() {

  const [viewModel, setViewModel] = useState(null);
  const [menuData, setMenuData] = useState(null);

  const initViewModel = async () => {
    try {
      const newViewModel = new ViewModel();
      await newViewModel.init();
      setViewModel(newViewModel);
    } catch (err) {
      console.error("Error loading the View Model:", err);
    }
  }

  const fetchMenuData = async () => {
    try {
      const menuDetails = await viewModel.getMenuFullDetailsById(12);
      setMenuData(menuDetails)
    } catch (err) {
      console.error("Error loading the Menu Data:", err);
    }
  }

  useEffect(() => {
    const initializeAndFetch = async () => {
      if (!viewModel) {
        await initViewModel();
      }
      if (viewModel) {
        await fetchMenuData();
      }
    };

    initializeAndFetch();
  }, [viewModel]); 

  console.log("------------- Rerendering -------------");

  if (!viewModel || viewModel.sessionData.firstLaunch) {
    return (
      <View style={styles.container}>
        <StatusBar style="auto" />
        <Text>Primo avvio completato.</Text>
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        <Text>N-esimo avvio completato.</Text>
        <Text>{menuData?.name}</Text>
        <Image source={{ uri: menuData?.image }} style={styles.image}></Image>
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
