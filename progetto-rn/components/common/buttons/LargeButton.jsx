import {TouchableOpacity, StyleSheet, Text} from 'react-native';
import {globalStyles} from '../../../styles/global';
import MyIcon, {IconNames} from '../icons/MyIcon';

export default LargeButton = ({text, gray=false, disabled=false, onPress}) => {

    const bgColor = (gray || disabled) ? globalStyles.bgLightGray : globalStyles.bgBlack;
    const borderColor = (disabled) ? {borderColor: colors.gray} : {borderColor: colors.Black};
    const textColor = (disabled) ? globalStyles.textDarkGray : (gray) ? globalStyles.textBlack : globalStyles.textWhite;

    return (
        <TouchableOpacity style={[styles.button, bgColor, borderColor]} onPress={() => onPress()} disabled={disabled}>
            <Text style={[styles.buttonText, textColor]}>{text}</Text>
        </TouchableOpacity>
    )
}


const styles = StyleSheet.create({
    button: {
        paddingVertical: 15,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 5,
        borderWidth: 2,
    },

    buttonText: {
        ...globalStyles.textNormalMedium,
    },
});