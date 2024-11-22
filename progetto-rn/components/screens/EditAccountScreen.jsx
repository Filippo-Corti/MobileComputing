import {View, Text, Button, StyleSheet} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {globalStyles} from '../../styles/global';

export default EditAccountScreen = ({}) => {

    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <Text>
                THIS IS THE EDIT ACCOUNT PAGE
            </Text>
            <Button title="Go Back" onPress={() => navigation.goBack()} />
        </View>
    );
}

const styles = StyleSheet.create({

    container: {
        ...globalStyles.container,
        backgroundColor: 'orange'
    },

});