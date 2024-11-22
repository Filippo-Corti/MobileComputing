import { ScrollView, Text, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { globalStyles } from '../../styles/global';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

export default HomeScreen = ({ }) => {

    const navigation = useNavigation();

    return (
        <SafeAreaProvider>
            <SafeAreaView style={globalStyles.container}>
                <ScrollView>
                    {/* Page Content starts here */}
                    <Text>
                        THIS IS THE HOME PAGE    
                    </Text>
                    <Button title="Details" onPress={() => navigation.navigate("MenuDetails")} />
                    
                    <StatusBar style="auto" />
                    </ScrollView>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({


});