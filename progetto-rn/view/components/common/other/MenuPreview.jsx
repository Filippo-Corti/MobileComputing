import {View, TouchableOpacity, Text, Image, StyleSheet} from 'react-native';
import {globalStyles} from '../../../../styles/global';
import MyIcon, {IconNames} from '../icons/MyIcon';

export default MenuPreview = ({menuInformation, onPress, style}) => {

    let image = menuInformation.image;
    if (image) {
        if (!image.startsWith("data:image/jpeg;base64,")) {
            image = "data:image/jpeg;base64," + image;
        }
    }

    let price = menuInformation.price.toFixed(2);

    return (
        <TouchableOpacity style={[styles.container, style]} onPress={() => onPress()}>
            <View style={styles.textContainer}>
                <Text style={styles.title}>{menuInformation.title}</Text>
                <Text style={styles.price}>€{price}</Text>
                <Text style={styles.description}>{menuInformation.description}</Text>
                <Text style={styles.otherInfo}>{menuInformation.deliveryTime}min • {menuInformation.distanceFromYou}km from you</Text>
            </View>
            <View style={styles.imageContainer}>
                {image && <Image source={{ uri: image }} style={styles.image} /> }
                {!image && <MyIcon name={IconNames.FOOD} size={100} color={colors.gray}/> }
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({

    container: {
        flexDirection: 'row',
        paddingHorizontal: 8,
        paddingVertical: 15,
        gap: 15,
        borderTopColor: colors.lightGray,
    },

    textContainer: {
        width: '60%',
    },

    title: {
        ...globalStyles.textBlack,
        ...globalStyles.textNormalMedium,
    },

    price: {
        ...globalStyles.textBlack,
        ...globalStyles.textSmallRegular,
    },

    description: {
        ...globalStyles.textDarkGray,
        ...globalStyles.textSmallRegular,
        marginBottom: 3,
    },

    otherInfo: {
        ...globalStyles.textBlack,
        ...globalStyles.textSmallRegular,
    },

    imageContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    image: {
        width: 120,
        height: 120,
    },

});