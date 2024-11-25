import {TouchableOpacity, StyleSheet, Text} from 'react-native';
import {globalStyles} from '../../../../styles/global';

export default MinimalistButton = ({text, onPress}) => {

    return (
        <TouchableOpacity style={styles.button} onPress={() => onPress()}>
            <Text style={styles.buttonText}>{text}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    button: {
        paddingVertical: 4,
        paddingHorizontal: 8,
    },

    buttonText: {
        ...globalStyles.textSecondary,
        ...globalStyles.textNormalMedium,
    },
});