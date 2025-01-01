import { View, StyleSheet } from 'react-native';
import colors from '../../../../styles/colors';

/**
 * @param {{
 *  progress: number
 * }} props 
 * @returns {JSX.Element}
 */
const ProgressBar = ({
    progress
}) => {

    const gap = 4;

    let splitProgress = [];
    for (let i = 0; i < 5; i++) {
        splitProgress.push((progress >= 20) ? 100 : progress * 100 / 20);
        progress = Math.max(progress - 20, 0);
    }

    return (
        <View style={[styles.container, { gap: gap }]}>
            {splitProgress.map((value, index) => {
                return (
                    <View key={index} style={{ flex: 1, width: '100%', height: '100%', backgroundColor: colors.gray, }}>
                        <View style={{ height: '100%', backgroundColor: colors.primary, width: `${value}%` }}>
                        </View>
                    </View>
                )
            })}
        </View>
    )
}

export default ProgressBar;

const styles = StyleSheet.create({
    container: {
        width: '100%',
        overflow: 'hidden',
        height: 5,
        flexDirection: 'row',
    },

    progress: {
        height: '100%',
    }
});