import { View, Text, Image, StyleSheet } from 'react-native';
import { globalStyles } from '../../../../styles/global';
import MyIcon, { IconNames } from '../icons/MyIcon';
import colors from '../../../../styles/colors';

/**
 * @param {{
 * image: string,
 * title: string,
 * price: number
 * }} props 
 * @returns {JSX.Element}
 */
const MenuSmallPreview = ({
    image, 
    title, 
    price 
}) => {

    const priceString = price.toFixed(2);

    return (
        <View style={[globalStyles.flexBetween, { gap: 20, marginHorizontal: 30, marginVertical: 20 }]}>
            <View style={styles.imageContainer}>
                {image && <Image source={{ uri: image }} style={styles.image} />}
                {!image && <View style={styles.iconContainer}>
                    <MyIcon name={IconNames.FOOD} size={100} color={colors.gray} />
                </View>}
            </View>
            <View style={{ flex: 1 }}>
                <Text style={[globalStyles.textBlack, globalStyles.textSubtitleMedium]}>{title}</Text>
                <Text style={[globalStyles.textDarkGray, globalStyles.textNormalRegular]}>{"€" + priceString}</Text>
            </View>
        </View>
    )
}

export default MenuSmallPreview;


const styles = StyleSheet.create({

    imageContainer: {
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },

    iconContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },

    image: {
        width: '100%',
        height: '100%',
    }

});