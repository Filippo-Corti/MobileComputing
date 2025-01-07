import {View, Text, StyleSheet} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import MyIcon, {IconNames} from '../icons/MyIcon';

/**
 * @param {{
 * cardInformation: {number: string, holder: string, expiryMonth: number, expiryYear: number},
 * }} props 
 * @returns {JSX.Element}
 */
const CreditCard = ({cardInformation}) => {

    const last4Digits = cardInformation.number.slice(-4);
    const formattedDate = cardInformation.expiryMonth.toString().padStart(2, '0') + '/' + cardInformation.expiryYear.toString().slice(-2);

    return (
        <View>
            <LinearGradient
                colors={['#833996', '#6467b4', '#4cace0']}
                style={styles.gradient}
                start={{x: 0.4, y: 1}}
                end={{x: 0.6, y: 0}}
                locations={[0, 0.2, 0.6]}
            />
            <View style={styles.container}>
                <View style={styles.badges}>
                    <MyIcon name={IconNames.CC_CHIP} size={40} color={'#f0c761'}/>
                    <MyIcon name={IconNames.VISA} size={38} color={'white'}/>
                </View>
                <View style={{width: '100%'}}>
                    <Text style={styles.number}>**** **** **** {last4Digits}</Text>
                </View>
                <View style={styles.info}>
                    <View>
                        <Text style={styles.label}>Card Holder name </Text>
                        <Text style={styles.data}>{cardInformation.holder}</Text>
                    </View>
                    <View>
                        <Text style={styles.label}>Expiry Date</Text>
                        <Text style={styles.data}>{formattedDate}</Text>
                    </View>
                </View>
            </View>
        </View>
    )
}

export default CreditCard;

const styles = StyleSheet.create({
    gradient: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        height: '100%',
        borderRadius: 25,
    },

    container: {
        padding: 26,
        alignItems: 'center',
        width: '100%',
    },

    badges: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 20,
    },

    number: {
        fontSize: 20,
        color: 'white',
        letterSpacing: 3,
        textAlign: 'left',
        alignSelf: 'flex-start', 
        width: '100%',
    },

    info: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
        width: '100%',
    },

    label: {
        color: 'white',
        fontSize: 12,
        marginBottom: 3,
    },

    data: {
        color: 'white',
        fontSize: 16,
    }

});