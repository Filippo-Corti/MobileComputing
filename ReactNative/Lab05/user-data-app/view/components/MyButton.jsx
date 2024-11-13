import { 
    TouchableOpacity, 
    Text, 
    StyleSheet 
} from "react-native";
import PropTypes from "prop-types";

const propTypes = {
    title: PropTypes.string.isRequired,
    onPress: PropTypes.func,
}

export default MyButton = ({title, onPress}) => {

    const handlePress = (() => onPress()) || (() => {});

    return (
        <TouchableOpacity style={styles.button} onPress={handlePress}>
            <Text style={styles.text}>{title}</Text>
        </TouchableOpacity>
    )
}

MyButton.propTypes = propTypes;

const styles = StyleSheet.create({

    button: {
        alignItems: 'center',
        backgroundColor: '#000',
        borderColor: '#FFF',
        borderWidth: 2,
        borderRadius: 15,
        paddingHorizontal: 12,
        paddingVertical: 4,
    },

    text: {
        fontSize: 15,
        color: '#FFF',
    }

});