import {View, Text, StyleSheet} from 'react-native';
import {globalStyles} from '../../styles/global';

export default LastOrderScreen = ({}) => {

    return (
        <View style={styles.container}>
            <Text>
                THIS IS THE LAST ORDER PAGE
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({

    container: {
        ...globalStyles.container,
        backgroundColor: 'green'
    },

});