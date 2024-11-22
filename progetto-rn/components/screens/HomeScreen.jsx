import {View, Text, Button, StyleSheet} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {globalStyles} from '../../styles/global';

export default HomeScreen = ({}) => {

    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <Text>
                THIS IS THE HOME PAGE
            </Text>
            <Button title="Details" onPress={() => navigation.navigate("MenuDetails")}/>
        </View>
    );
}

const styles = StyleSheet.create({

    container: {
        ...globalStyles.container,
        backgroundColor: 'pink'
    },

});