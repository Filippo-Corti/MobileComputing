import {View, Text, StyleSheet} from 'react-native';
import MyIcon from '../icons/MyIcon';
import {globalStyles} from '../../../../styles/global';

/**
 * @param {{
 * text: string,
 * label: string?,
 * iconName: string
 * }} props 
 * @returns {JSX.Element}
 */
const InfoTextBox = ({
    text, 
    label = null, 
    iconName
}) => {

    return (
        <View style={styles.container}>
            { iconName && <View>
                <MyIcon name={iconName} size={32} color="black"/>
            </View> }
            <View style={{flex: 1}}>
                { label && <Text style={styles.label}>{label}</Text> }
                <Text style={styles.text}>{text}</Text>
            </View>
        </View>
    )

}

export default InfoTextBox;

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
        maxWidth: '100%',
        flexWrap: 'wrap',
        flexShrink: 1,
    },


});
