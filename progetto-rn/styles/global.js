import { StyleSheet } from 'react-native';
import colors from './colors';

const fontSizes = {
    verySmall: 10,
    small: 14,
    normal: 16,
    subtitle: 20,
    title: 24,
}

export const fonts = {
    regular: 'UberMoveText-Regular',
    medium: 'UberMoveText-Medium',
    bold: 'UberMoveText-Bold',
    logo: 'Geologica-Roman-Medium',
};

function colorStyles() {
  let styles = {}
  for (const [key, value] of Object.entries(colors)) {
    const capitalizedKey = key.charAt(0).toUpperCase() + key.slice(1);
    styles["text" + capitalizedKey] = {
      color: value,
    };
    styles["bg" + capitalizedKey] = {
      backgroundColor: value,
    };
  }
  return styles
}

function typographyStyles() {
  let styles = {}
  for (const [fontSize, fontSizeValue] of Object.entries(fontSizes)) {
    const capitalizedFontSize = fontSize.charAt(0).toUpperCase() + fontSize.slice(1);
    for (const [fontWeight, fontWeightValue] of Object.entries(fonts)) {
      const capitalizedFontWeight = fontWeight.charAt(0).toUpperCase() + fontWeight.slice(1);
      styles["text" + capitalizedFontSize + capitalizedFontWeight] = {
        fontSize: fontSizeValue,
        fontFamily: fontWeightValue,
      };
    }
  }
  return styles
}

export const globalStyles = StyleSheet.create({
  ...colorStyles(),
  ...typographyStyles(),

  container: {
    backgroundColor: colors.white,
    paddingVertical: 8,
    flex: 1,
  },

  insetContainer: {
    backgroundColor: colors.white,
    paddingHorizontal: 15,
  },

});
