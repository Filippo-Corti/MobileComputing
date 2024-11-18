import React, { useMemo, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, FlatList } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet from '@gorhom/bottom-sheet';
import MapView from 'react-native-maps';

const { height } = Dimensions.get('window');

export default function App() {
  const bottomSheetRef = useRef(null);

  // Define snap points for the bottom sheet
  console.log("Height", height);
  const snapPoints = useMemo(() => [height * 0.3, height], []);

  return (
    <GestureHandlerRootView style={styles.container}>
      {/* Map View */}
      <MapView
        style={StyleSheet.absoluteFillObject}
        initialRegion={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      />

      {/* Bottom Sheet */}
      <BottomSheet
        ref={bottomSheetRef}
        index={0} // Start at 30% height
        snapPoints={snapPoints}
        enablePanDownToClose={false} // Prevent closing
      >
        <Text>Ciao</Text>
        <FlatList
          data={Array.from({ length: 20 }, (_, i) => `Item ${i + 1}`)}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.listItem}>
              <Text style={styles.listText}>{item}</Text>
            </View>
          )}
          contentContainerStyle={styles.scrollableContent}
        />
      </BottomSheet>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listItem: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  listText: {
    fontSize: 16,
  },
  scrollableContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
});
