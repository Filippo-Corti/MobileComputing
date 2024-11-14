import {
    View,
    TextInput,
    Text,
    StyleSheet,
} from 'react-native'
import { Controller } from 'react-hook-form'
import PropTypes from 'prop-types';


const propTypes = {
    name: PropTypes.string.isRequired,
    label: PropTypes.string,
    error: PropTypes.shape({
        message: PropTypes.string,
    }),
    control: PropTypes.object.isRequired,
    validate: PropTypes.func,
    inputProps: PropTypes.object,
};


export default FormField = ({ name, label, error, control, validate, ...inputProps }) => {

    validate = validate || ((v) => true); 

    return (
        <View style={styles.container}>
            {label && <Text style={[styles.label]}>{label}</Text>}

            <Controller
                control={control}
                name={name}
                rules={{
                    validate: {validate},
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                        autoCapitalize="none"
                        style={[styles.inputContainer, { borderColor: error ? '#fc6d47' : '#c3c0c7' }]}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        {...inputProps}
                    />
                )}
            />
            {error && <Text style={styles.textError}>{error.message}</Text>}
        </View>
    )
}

FormField.propTypes = propTypes;

const styles = StyleSheet.create({
    container: {
        paddingVertical: 8,
        width: '100%',
    },

    label: {
        color: '#c3c0c7',
        fontSize: 14,
    },

    text: {
        color: '#FFFFFF',
        paddingVertical: 2,
        fontSize: 18,
    },

    inputContainer: {
        width: '100%',
        borderBottomWidth: 1,
        borderRadius: 4,
        color: '#FFFFFF',
        padding: 8,
        fontSize: 16,
    },

    textError: {
        color: '#fc6d47',
        marginTop: 8,
    },
});