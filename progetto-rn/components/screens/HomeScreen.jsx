import { View, ScrollView, Text, Button, StyleSheet, Dimensions } from 'react-native';
import MapView from 'react-native-maps';
import { useNavigation } from '@react-navigation/native';
import { globalStyles } from '../../styles/global';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

const { height } = Dimensions.get('window');

export default HomeScreen = ({ }) => {

    const navigation = useNavigation();

    return (
        <SafeAreaProvider>
            <SafeAreaView style={globalStyles.container}>
                <ScrollView>
                    {/* Page Content starts here */}

                    <View style={globalStyles.insetContainer}>
                        <Text>
                            THIS IS THE HOME PAGE    
                        </Text>
                        <Button title="Details" onPress={() => navigation.navigate("MenuDetails")} />
                    </View>
                    <MapView
                        style={styles.map}
                        initialRegion={{
                            latitude: 45.476770,
                            longitude: 9.232131,
                            latitudeDelta: 0.01,
                            longitudeDelta: 0.01,
                        }}
                    />
                    <View style={[globalStyles.insetContainer, styles.afterMap]}>
                        <Text>
                            THIS IS THE HOME PAGE    
                        </Text>
                        <Button title="Details" onPress={() => navigation.navigate("MenuDetails")} />
                    </View>

                    <StatusBar style="auto" />
                    </ScrollView>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({

  map: {
    width: '100%',
    height: height * 0.30,
  },

  afterMap: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    transform: [{translateY: -30}]
  }

});