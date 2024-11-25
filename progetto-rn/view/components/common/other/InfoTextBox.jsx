import {View, Text, StyleSheet} from 'react-native';
import MyIcon from '../icons/MyIcon';
import {globalStyles} from '../../../../styles/global';

export default InfoTextBox = ({text, label, iconName}) => {

    return (
        <View style={styles.container}>
            { iconName && <View style={styles.iconContainer}>
                <MyIcon name={iconName} size={32} color="black"/>
            </View> }
            <View style={styles.textContainer}>
                { label && <Text style={styles.label}>{label}</Text> }
                <Text style={styles.text}>{text}</Text>
            </View>
        </View>
    )

}

const styles = StyleSheet.create({

    container: {
        marginVertical: 20,
        marginHorizontal: 30,
        flexDirection: 'row',
        gap: 20,
        alignItems: 'center'
    },

    label: {
        ...globalStyles.textDarkGray,
        ...globalStyles.textSmallRegular,
    },

    text: {
        ...globalStyles.textBlack,
        ...globalStyles.textNormalMedium,
    },


});
