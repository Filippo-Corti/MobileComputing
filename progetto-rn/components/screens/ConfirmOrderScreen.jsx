import { View, Text, Button, StyleSheet } from 'react-native';
import { CommonActions  } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { globalStyles } from '../../styles/global';

export default ConfirmOrderScreen = ({ }) => {

    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <Text>
                THIS IS THE CONFIRM ORDER PAGE
            </Text>
            <Button title="Go to Last Order" onPress={() => {
                navigation.dispatch(
                    CommonActions.reset({
                      index: 1, 
                      routes: [{ name: "HomeStack" }, { name: "LastOrder" }],
                    })
                  );
            }} />
            <Button title="Go Back" onPress={() => navigation.goBack()} />
        </View>
    );
}

const styles = StyleSheet.create({

    container: {
        ...globalStyles.container,
        backgroundColor: 'red'
    },

});