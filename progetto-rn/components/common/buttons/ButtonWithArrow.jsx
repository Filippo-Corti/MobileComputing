import {TouchableOpacity, StyleSheet, Text} from 'react-native';
import {globalStyles} from '../../../styles/global';
import MyIcon, {IconNames} from '../icons/MyIcon';

export default ButtonWithArrow = ({text, onPress}) => {

    return (
        <TouchableOpacity style={styles.button} onPress={() => onPress()}>
            <Text style={styles.buttonText}>{text}</Text>
            <MyIcon name={IconNames.ARROW_RIGHT} size={15} color={colors.white} />
        </TouchableOpacity>
    )
}


const styles = StyleSheet.create({
    button: {
        ...globalStyles.bgBlack,
        paddingVertical: 8,
        paddingHorizontal: 12,
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        borderRadius: 30,
        gap: 5,
    },

    buttonText: {
        ...globalStyles.textWhite,
        ...globalStyles.textNormalMedium,
    },
});