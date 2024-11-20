import {View, Text, StyleSheet} from 'react-native';
import {globalStyles} from '../../styles/global';

export default AccountScreen = ({}) => {

    return (
        <View style={styles.container}>
            <Text>
                THIS IS THE ACCOUNT PAGE
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({

    container: {
        ...globalStyles.container,
        backgroundColor: 'cyan'
    },

});