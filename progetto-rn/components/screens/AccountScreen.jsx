import {View, Text, Button, StyleSheet} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {globalStyles} from '../../styles/global';

export default AccountScreen = ({}) => {

    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <Text>
                THIS IS THE ACCOUNT PAGE
            </Text>
            <Button title="Edit Account" onPress={() => navigation.navigate("EditAccount")}/>
        </View>
    );
}

const styles = StyleSheet.create({

    container: {
        ...globalStyles.container,
        backgroundColor: 'cyan'
    },

});