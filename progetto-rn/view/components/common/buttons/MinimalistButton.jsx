import {TouchableOpacity, StyleSheet, Text} from 'react-native';
import {globalStyles} from '../../../../styles/global';

/**
 * @param {{
 * text: string,
 * onPress: function
 * }} props
 * @returns {JSX.Element}
 */
const MinimalistButton = ({
    text, 
    onPress
}) => {

    return (
        <TouchableOpacity style={styles.button} onPress={() => onPress()}>
            <Text style={styles.buttonText}>{text}</Text>
        </TouchableOpacity>
    )
}

export default MinimalistButton;

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