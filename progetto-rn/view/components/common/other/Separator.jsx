import {View, StyleSheet, Dimensions} from 'react-native';

export default Separator = ({size, color}) => {

    return (
        <View style={{
            width: '100%',
            height: size,
            backgroundColor: color,
        }}></View>
    )
}