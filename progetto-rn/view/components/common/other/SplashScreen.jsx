import {View, Image} from 'react-native';
import colors from '../../../../styles/colors';

/**
 * @param {{
 * }} props 
 * @returns {JSX.Element}
 */
const SplashScreen = ({
}) => {

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.primary }}>
            <View style={{width: 120, height: 120, flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <Image 
                    // @ts-ignore
                    source={require('../../../../assets/logo-green.png')}
                    style={{ resizeMode: 'contain', width: '100%' }}
                />
            </View>
        </View>
    )
}

export default SplashScreen;