import {View, Text, StyleSheet} from 'react-native';
import {globalStyles} from '../../styles/global';

export default HomeScreen = ({}) => {

    return (
        <View style={styles.container}>
            <Text>
                THIS IS THE HOME PAGE
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({

    container: {
        ...globalStyles.container,
        backgroundColor: 'pink'
    },

});