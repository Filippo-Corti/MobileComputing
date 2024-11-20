import Foundation from '@expo/vector-icons/Foundation';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import AntDesign from '@expo/vector-icons/AntDesign';
import Entypo from '@expo/vector-icons/Entypo';
import Fontisto from '@expo/vector-icons/Fontisto';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

export const IconNames = {
    HOME                    : 'home',
    SHOPPING_BAG            : 'shopping_bag',
    USER                    : 'user',
    CREDIT_CARD             : 'credit_card',
    CLOCK                   : 'clock',
    FOOD                    : 'food',
    ARROW_DOWN              : 'arrow_down',
    ARROW_LEFT              : 'arrow_left',
    ARROW_RIGHT             : 'arrow_right',
    PRICE_TAG               : 'price_tag',
    MARKER                  : 'marker',
    NAVIGATOR               : 'navigator'
}

export default MyIcon = ({name, size, color}) => {

    switch(name) {
        case IconNames.HOME: 
            return (<Foundation name="home" size={size} color={color} />)
        case IconNames.SHOPPING_BAG: 
            return (<FontAwesome5 name="shopping-bag" size={size} color={color} />)
        case IconNames.USER: 
            return (<FontAwesome6 name="user-large" size={size} color={color} />)
        case IconNames.CREDIT_CARD:
            return (<FontAwesome name="credit-card-alt" size={size} color={color} />)
        case IconNames.CLOCK:
            return (<MaterialCommunityIcons name="clock-fast" size={size} color={color} />)
        case IconNames.FOOD:
            return (<MaterialCommunityIcons name="silverware-fork-knife" size={size} color={color} />)
        case IconNames.ARROW_DOWN: 
            return (<FontAwesome6 name="chevron-down" size={size} color={color} />)
        case IconNames.ARROW_LEFT:
            return (<AntDesign name="arrowleft" size={size} color={color} />)
        case IconNames.ARROW_RIGHT:
            return (<AntDesign name="arrowright" size={size} color={color} />)
        case IconNames.PRICE_TAG:
            return (<Entypo name="price-tag" size={size} color={color} />)
        case IconNames.MARKER:
            return (<FontAwesome5 name="map-marker-alt" size={size} color={color} />)
        case IconNames.NAVIGATOR:
            return (<Fontisto name="navigate" size={size} color={color} />)
    }
}