import {useState} from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TextInputProps,
} from 'react-native'
import { Controller, FieldError } from 'react-hook-form'

interface FormFieldProps extends TextInputProps {
    name: string;
    label?: string;
    error?: FieldError | undefined;
    control: Object;
}

export default function FormField(props : FormFieldProps) {

    const { name, label, error, control, ...inputProps } = props;

    return (
        <View style={styles.container}>
            {label && <Text style={[styles.label]}>{label}</Text>}
            
            <Controller
                control={control}
                name={name}
                render={({field: {onChange, onBlur, value}}) => (
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