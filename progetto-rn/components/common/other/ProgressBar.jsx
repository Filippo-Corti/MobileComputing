import {View, StyleSheet} from 'react-native'; 
import colors from '../../../styles/colors';

export default ProgressBar = ({progress}) => {

    let splitProgress = [];
    for (let i = 0; i < 5; i++) {
        splitProgress.push((progress >= 20) ? 100 : progress*100/20);
        progress = Math.max(progress - 20, 0);
    }

    return (
        <View style={styles.container}>
            {splitProgress.map((value, index) => {
                return (
                    <View key={index} style={{flex: 1, width: '100%', height: '100%', backgroundColor: colors.gray,}}>
                        <View style={{height: '100%', backgroundColor: colors.primary, width: value + '%'}}>
                        </View>
                    </View>
                )
            })}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        overflow: 'hidden',
        height: 5,
        flexDirection: 'row',
        gap: 12,
    },

    progress: {
        height: '100%',
    }
});