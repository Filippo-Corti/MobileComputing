import { ScrollView, View, Text, Image, Button, StyleSheet, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { globalStyles, imageBase64 } from '../../styles/global';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import MyIcon, { IconNames } from '../common/icons/MyIcon';
const { height } = Dimensions.get('window');

export default MenuDetailsScreen = ({ menuInformation }) => {

    menuInformation = {
        title: 'McMushroom Pizza2',
        price: 17,
        description: 'Garlic, olive oil base, mozarella, cremini mushrooms, ricotta, thyme, white truffle oil. Add arugula for an extra charge',
        deliveryTime: 30,
        distanceFromYou: 0.2,
        image: imageBase64,
    }

    let image = menuInformation.image;
    if (image) {
        if (!image.startsWith("data:image/jpeg;base64,")) {
            image = "data:image/jpeg;base64," + image;
        }
    }

    const navigation = useNavigation();

    return (
        <SafeAreaProvider>
            <SafeAreaView style={globalStyles.container}>
                <ScrollView style={{ width: '100%' }}>


                    <View style={styles.imageContainer}>
                        {image && <Image source={{ uri: image }} style={styles.image} />}
                        {!image && <View style={styles.iconContainer}>
                            <MyIcon name={IconNames.FOOD} size={100} color={colors.gray} />
                        </View>}

                        <View style={[styles.backArrowContainer, {borderWidth: (!image) ? 1 : 0}]}>
                            <MyIcon name={IconNames.ARROW_LEFT} size={32} color={colors.black} />
                        </View>

                    </View>


                </ScrollView>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({

    imageContainer: {
        width: '100%',
        height: height * 0.25,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },

    iconContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },

    backArrowContainer: {
        padding: 10,
        backgroundColor: colors.white,
        borderRadius: '50%',
        position: 'absolute',
        left: 15,
        top: 15,
    },

    image: {
        width: '100%',
        height: '100%',
    }

});