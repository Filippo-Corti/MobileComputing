import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import {useFonts} from 'expo-font';
import {fonts, globalStyles} from './styles/global';
import MyIcon, {IconNames} from './components/common/icons/MyIcon';
import MyLogo from './components/common/icons/MyLogo';
import MinimalistButton from './components/common/buttons/MinimalistButton';
import ButtonWithArrow from './components/common/buttons/ButtonWithArrow';

export default function App() {

  const [fontsLoaded] = useFonts({
    [fonts.regular]: require('./assets/fonts/UberMoveText-Regular.otf'),
    [fonts.medium]: require('./assets/fonts/UberMoveText-Medium.otf'),
    [fonts.bold]: require('./assets/fonts/UberMoveText-Bold.otf'),
    [fonts.logo]: require('./assets/fonts/Geologica-Medium.ttf'),
  });

  return (
    <View style={globalStyles.container}>
      <Text style={[globalStyles.textBlack, globalStyles.textTitleBold]}>Hello</Text>
      <Text style={[globalStyles.textPrimary, globalStyles.textSmallRegular]}>Hello</Text>
      <MyLogo />
      <MinimalistButton text="NEW ACCOUNT" onPress={() => console.log("Pressed")}/>
      <ButtonWithArrow text="Order Again" onPress={() => console.log("Pressed")}/>
      <StatusBar style="auto" />
    </View>
  );
}
