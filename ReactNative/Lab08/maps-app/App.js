import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import ViewModel from './viewmodel/ViewModel';
import ViewModelPosition from './viewmodel/ViewModelPosition';

const LOCATIONS = {
  dipartimento: {
    latitude: 45.476770,
    longitude: 9.232131,
  },

  ingressoCeloria: {
    latitude: 45.476911,
    longitude: 9.232021,
  },
}

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
      const menuDetails = await viewModel.getMenuFullDetailsById(12, 45.4642, 9.19);
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
        const allowedToLocation = await ViewModelPosition.askForLocationPermission();
        if (allowedToLocation) {
          const location = await ViewModelPosition.getPosition();
          console.log(location);
        }
        console.log("Done", allowedToLocation);
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
        <Image source={{ uri: menuData?.image }} style={styles.image} />
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            initialRegion={{
              ...LOCATIONS.dipartimento,
              latitudeDelta: 0.001,
              longitudeDelta: 0.001,
            }}
          >
            <Marker
              coordinate={LOCATIONS.ingressoCeloria}
              title="prova"
              description="descrizione"
              onPress={() => console.log("Hello Marker")}
            >
             
            </Marker>
          </MapView>
        </View>
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

  mapContainer: {
    width: '100%',
    height: 250,
    marginTop: 16,
  },

  map: {
    ...StyleSheet.absoluteFillObject
  },

  callout: {
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderColor: '#ccc',
    borderWidth: 1,
    width: 200, // Ensures the callout doesn't expand too much
  },

});
