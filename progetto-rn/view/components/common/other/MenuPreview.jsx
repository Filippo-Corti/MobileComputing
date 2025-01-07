import { View, TouchableOpacity, Text, Image, StyleSheet } from 'react-native';
import { globalStyles } from '../../../../styles/global';
import MyIcon, { IconNames } from '../icons/MyIcon';
import PositionViewModel from '../../../../viewmodel/PositionViewModel';
import colors from '../../../../styles/colors';
import { AppStateContext } from '../../../context/AppStateContext';
import { useContext } from 'react';

/**
 * @param {{
 *  menu: MenuWithImage | MenuDetailsWithImage,
 *  onPress : Function?,
 *  style: import('react-native').ViewStyle
 * }} props
 * @returns {JSX.Element}
 */
const MenuPreview = ({ 
    menu, 
    onPress = null,
    style 
}) => {

    onPress = onPress || (() => {});

    const {locationState} = useContext(AppStateContext);
    
    const distanceFromYou = (locationState.lastKnownLocation) 
        ? PositionViewModel.coordinatesDistanceInKm(locationState.lastKnownLocation, menu.menu.location).toFixed(1)
        : null;

    const deliveryTime = (menu.menu.deliveryTime > 0) ? menu.menu.deliveryTime : "<1";

    const price = menu.menu.price.toFixed(2);

    return (
        <TouchableOpacity style={[styles.container, style]} onPress={() => onPress()}>
            <View style={styles.textContainer}>
                <View>
                    <Text style={styles.title}>{menu.menu.name}</Text>
                    <Text style={styles.price}>€{price}</Text>
                    <Text style={styles.description}>{menu.menu.shortDescription}</Text>
                </View>
                <View>
                    {distanceFromYou && <Text style={styles.otherInfo}>{deliveryTime}min • {distanceFromYou}km from you</Text>}
                </View>
            </View>
            <View style={styles.imageContainer}>
                {menu.image && <Image source={{ uri: menu.image.base64 }} style={styles.image} />}
                {!menu.image && <MyIcon name={IconNames.FOOD} size={100} color={colors.gray} />}
            </View>
        </TouchableOpacity>
    );
}

export default MenuPreview;

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