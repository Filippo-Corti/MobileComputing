import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import MyIcon, {IconNames} from '../common/icons/MyIcon';
import {globalStyles} from '../../../styles/global';

export default MyTabBar = ({state, descriptors, navigation}) => {

    const iconNames = [IconNames.HOME, IconNames.SHOPPING_BAG, IconNames.USER];
    const iconSizes = [32, 28, 28]
    const texts = ["Home", "Last Order", "Account"]

    return (
        <View style={{flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 14}}>
            {state.routes.map((route, index) => {
                const {options} = descriptors[route.key];
                const label = options.tabBarLabel !== undefined ? options.tabBarLabel : options.title !== undefined ? options.title : route.name;

                const isFocused = state.index === index;

                const onPress = () => {
                    const event = navigation.emit({
                        type: 'tabPress',
                        target: route.key,
                        canPreventDefault: true,
                    });

                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate(route.name);
                    }
                };

                const onLongPress = () => {
                    navigation.emit({
                        type: 'tabLongPress',
                        target: route.key,
                    });
                };

                return (
                    <TouchableOpacity
                        accessibilityRole="button"
                        accessibilityState={isFocused ? {selected: true} : {}}
                        accessibilityLabel={options.tabBarAccessibilityLabel}
                        testID={options.tabBarTestID}
                        onPress={onPress}
                        onLongPress={onLongPress}
                        style={{flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1}}
                        key={index}
                    >
                        <MyIcon name={iconNames[index]} size={iconSizes[index]} color={isFocused ? colors.black : colors.gray}/>
                        <Text style={[isFocused ? globalStyles.textBlack : globalStyles.textGray, globalStyles.textVerySmallRegular]}>{texts[index]}</Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );

}
