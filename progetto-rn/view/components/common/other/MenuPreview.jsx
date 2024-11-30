import { View, TouchableOpacity, Text, Image, StyleSheet } from 'react-native';
import { globalStyles } from '../../../../styles/global';
import MyIcon, { IconNames } from '../icons/MyIcon';
import PositionViewModel from '../../../../viewmodel/PositionViewModel';

export default MenuPreview = ({ menuInformation, onPress, style }) => {

    const userLocation = {
        longitude: -122.427,
        latitude: 37.422,
    }

    onPress = onPress || (() => {})


    const distanceFromYou = PositionViewModel.coordinatesDistanceInKm(userLocation, menuInformation.location).toFixed(1);

    return (
        <TouchableOpacity style={[styles.container, style]} onPress={() => onPress()}>
            <View style={styles.textContainer}>
                <View>
                    <Text style={styles.title}>{menuInformation.name}</Text>
                    <Text style={styles.price}>€{menuInformation.formatPrice()}</Text>
                    <Text style={styles.description}>{menuInformation.shortDescription}</Text>
                </View>
                <View>
                    <Text style={styles.otherInfo}>{menuInformation.deliveryTime}min • {distanceFromYou}km from you</Text>
                </View>
            </View>
            <View style={styles.imageContainer}>
                {menuInformation.image && <Image source={{ uri: menuInformation.image }} style={styles.image} />}
                {!menuInformation.image && <MyIcon name={IconNames.FOOD} size={100} color={colors.gray} />}
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