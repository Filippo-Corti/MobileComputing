import {View, Text, Button, StyleSheet} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {globalStyles} from '../../styles/global';

export default MenuDetailsScreen = ({}) => {

    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <Text>
                THIS IS THE MENU DETAILS PAGE
            </Text>
            <Button title="Checkout" onPress={() => navigation.navigate("ConfirmOrder")}/>
            <Button title="Go to Edit Account" onPress={() => navigation.navigate("AccountStack", { screen: "EditAccount" })} />
            <Button title="Go Back" onPress={() => navigation.goBack()} />
        </View>
    );
}

const styles = StyleSheet.create({

    container: {
        ...globalStyles.container,
        backgroundColor: 'yellow'
    },

});