import { TouchableOpacity, Text, StyleSheet } from "react-native";

export default function MyButton({title, onPress}) {

    return (
        <TouchableOpacity style={styles.button} onPress={() => onPress()}>
            <Text style={styles.text}>{title}</Text>
        </TouchableOpacity>
    )
}


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