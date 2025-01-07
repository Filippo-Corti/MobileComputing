import {View} from 'react-native';

/**
 * @param {{
 * size: number,
 * color: import('react-native').ColorValue,
 * }} props 
 * @returns {JSX.Element}
 */
const Separator = ({
    size, 
    color
}) => {

    return (
        <View style={{
            width: '100%',
            height: size,
            backgroundColor: color,
        }}></View>
    )
}

export default Separator;