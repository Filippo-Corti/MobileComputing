import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView} from 'react-native';
import {useFonts} from 'expo-font';
import {fonts, globalStyles} from './styles/global';

export default function App() {

  const [fontsLoaded] = useFonts({
    [fonts.regular]: require('./assets/fonts/UberMoveText-Regular.otf'),
    [fonts.medium]: require('./assets/fonts/UberMoveText-Medium.otf'),
    [fonts.bold]: require('./assets/fonts/UberMoveText-Bold.otf'),
    [fonts.logo]: require('./assets/fonts/Geologica-Medium.ttf'),
  });

  return (
    <ScrollView 
      style={globalStyles.container}
      contentContainerStyle={styles.scrollContent}
    >
      <Text>Hello</Text>

      <StatusBar style="auto" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexDirection: 'column',
    gap: 20,
  }
})
