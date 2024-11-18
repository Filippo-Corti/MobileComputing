import { StatusBar } from 'expo-status-bar';
import { useEffect, useState, useRef } from 'react';
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
  const mapRef = useRef();

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
        //await fetchMenuData();
        const allowedToLocation = await ViewModelPosition.askForLocationPermission();
        if (allowedToLocation) {
          console.log("We have position");
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
            showsUserLocation={true}
            followsUserLocation={true}
            onUserLocationChange={(event) => {
              const { coordinate } = event.nativeEvent;
              console.log("User's new location:", coordinate);
              const latitudeDelta = Math.abs(LOCATIONS.ingressoCeloria.latitude - coordinate.latitude) * 2 + 0.002;
              const longitudeDelta = Math.abs(LOCATIONS.ingressoCeloria.longitude - coordinate.longitude) * 2 + 0.002;
              console.log("Latitude Delta", latitudeDelta, longitudeDelta);
              // Optionally, animate the map to center on the new location
              mapRef.current?.animateToRegion({
                latitude: coordinate.latitude,
                longitude: coordinate.longitude,
                latitudeDelta: Math.max(0.001, latitudeDelta),
                longitudeDelta: Math.max(0.001, longitudeDelta),
              }, 1000);
            }}
            ref={mapRef}
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
