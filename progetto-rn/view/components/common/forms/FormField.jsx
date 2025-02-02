import {
    View,
    TextInput,
    Text,
    StyleSheet,
} from 'react-native'
import {globalStyles} from '../../../../styles/global'
import { Controller } from 'react-hook-form'

/**
 * @param {{
 * name: string,
 * label: string,
 * error: import('react-hook-form').FieldError,
 * control: import('react-hook-form').Control<any, any>,
 * validate: import('react-hook-form').Validate<any, any>,
 * inputProps?: React.ComponentProps<typeof TextInput>,
 * }} props
 * @returns 
 */
const FormField = ({ 
    name, 
    label, 
    error, 
    control, 
    validate, 
    inputProps 
}) => {

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

export default FormField;


const styles = StyleSheet.create({
    container: {
        paddingVertical: 8,
        width: '100%',
    },

    label: {
        ...globalStyles.textDarkGray,
        ...globalStyles.textSmallRegular,
    },

    inputContainer: {
        width: '100%',
        borderBottomWidth: 1,
        borderRadius: 4,
        paddingVertical: 8,
        ...globalStyles.textBlack,
        ...globalStyles.textNormalMedium,
    },

    textError: {
        color: '#fc6d47',
        marginTop: 8,
    },
});