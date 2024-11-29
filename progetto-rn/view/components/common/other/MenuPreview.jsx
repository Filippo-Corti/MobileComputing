import { View, TouchableOpacity, Text, Image, StyleSheet } from 'react-native';
import { globalStyles } from '../../../../styles/global';
import MyIcon, { IconNames } from '../icons/MyIcon';

export default MenuPreview = ({ menuInformation, onPress, style }) => {

    let image = menuInformation.image;
    if (image) {
        if (!image.startsWith("data:image/jpeg;base64,")) {
            image = "data:image/jpeg;base64," + image;
        }
    }

    return (
        <TouchableOpacity style={[styles.container, style]} onPress={() => onPress()}>
            <View style={styles.textContainer}>
                <View>
                    <Text style={styles.title}>{menuInformation.title}</Text>
                    <Text style={styles.price}>€{menuInformation.price}</Text>
                    <Text style={styles.description}>{menuInformation.description}</Text>
                </View>
                <View>
                    <Text style={styles.otherInfo}>{menuInformation.deliveryTime}min • {menuInformation.distanceFromYou}km from you</Text>
                </View>
            </View>
            <View style={styles.imageContainer}>
                {image && <Image source={{ uri: image }} style={styles.image} />}
                {!image && <MyIcon name={IconNames.FOOD} size={100} color={colors.gray} />}
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
        justifyContent: 'space-between',
    },

    title: {
        ...globalStyles.textBlack,
        ...globalStyles.textNormalMedium,
    },

    price: {
        ...globalStyles.textBlack,
        ...globalStyles.textSmallRegular,
        marginBottom: 4,
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