import {View, Text, StyleSheet} from 'react-native';
import {globalStyles} from '../../../../styles/global';

/**
 * @returns {JSX.Element}
 */
const MyLogo = () => {
    return (
        <View>
            <Text style={styles.logoFirst}>Mangia</Text>
            <Text style={styles.logoSecond}>e Basta</Text>
        </View>
    )
}

export default MyLogo;

const styles = StyleSheet.create({
    logoFirst: {
        ...globalStyles.textTitleLogo, 
        ...globalStyles.textBlack,
        lineHeight: 24,
    },

    logoSecond: {
        ...globalStyles.textTitleLogo, 
        ...globalStyles.textPrimary,
        lineHeight: 24,
        transform: [{translateY: -4}, {translateX: 8}],
    },
});