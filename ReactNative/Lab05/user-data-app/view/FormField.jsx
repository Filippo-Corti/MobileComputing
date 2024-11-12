import {
  View,
  TextInput,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TextInputProps,
} from 'react-native'
import { FieldError } from 'react-hook-form'
interface Props extends TextInputProps {
  name: string
  label?: string
  labelStyle?: TextStyle
  error?: FieldError | undefined
}

export default function FormField() {
    const { label, labelStyle, error, ...inputProps } = props

    return (
      <View style={styles.container}>
        {label && <Text style={[styles.label, labelStyle]}>{label}</Text>}
        <TextInput
          autoCapitalize="none"
          ref={ref}
          style={[
            styles.inputContainer,
            { borderColor: error ? '#fc6d47' : '#c0cbd3' },
          ]}
          {...inputProps}
        />
        <Text style={styles.textError}>{error && error.message}</Text>
      </View>
    )
  }
)