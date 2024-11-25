import { StyleSheet, Text, View } from 'react-native';
import SelectDropdown from 'react-native-select-dropdown';
import { Controller } from 'react-hook-form'
import { globalStyles } from '../../../styles/global';

export default SelectNumer = ({ name, min, max, error, control, validate, style }) => {

  const data = new Array(max - min + 1).fill().map((_, idx) => (min + idx).toString().padStart(2, '0'));

  return (
    <View style={[style]}>
      <Controller
        control={control}
        name={name}
        rules={{
          validate: { validate },
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <SelectDropdown
            data={data}
            onBlur={onBlur}
            onSelect={(val) => onChange(val)}
            defaultValue={value}
            renderButton={(selectedItem, isOpen) => {
              return (
                <View style={styles.dropdownButtonStyle}>
                  <Text style={styles.dropdownButtonTxtStyle}>{selectedItem || '00'}</Text>
                </View>
              );
            }}
            renderItem={(item, index, isSelected) => {
              return (
                <View
                  style={{
                    ...styles.dropdownItemStyle,
                    ...(isSelected && { backgroundColor: '#D2D9DF' }),
                  }}>
                  <Text style={styles.dropdownItemTxtStyle}>{item}</Text>
                </View>
              );
            }}
            dropdownStyle={styles.dropdownMenuStyle}
          />
        )}
      />
      {error && <Text style={styles.textError}>{error.message}</Text>}

    </View>
  )
}


const styles = StyleSheet.create({
  dropdownButtonStyle: {
    width: '100%',
    backgroundColor: colors.white,
    borderColor: colors.darkGray,
    borderWidth: 1,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  dropdownButtonTxtStyle: {
    flex: 1,
    textAlign: 'center',
    ...globalStyles.textBlack,
    ...globalStyles.textNormalMedium,
  },
  dropdownMenuStyle: {
    backgroundColor: colors.lightGray,
    borderRadius: 8,
    height: 150,
  },
  dropdownItemStyle: {
    width: '100%',
    flexDirection: 'row',
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray,
  },
  dropdownItemTxtStyle: {
    flex: 1,
    textAlign: 'center',
    ...globalStyles.textBlack,
    ...globalStyles.textNormalMedium,
  },
  dropdownItemIconStyle: {
    fontSize: 28,
    marginRight: 8,
  },
});