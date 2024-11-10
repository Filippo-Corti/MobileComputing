import MyButton from "@/components/MyButton";
import MyHeader from "@/components/MyHeader";
import MyMap from "@/components/MyMap";
import { Colors } from "@/constants/Colors";
import { Stack } from "expo-router";
import { Image, Text, View, StyleSheet } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  return (
    <SafeAreaProvider style={{backgroundColor: Colors.light.background}}>
      <SafeAreaView style={styles.container}>
        <MyHeader title="Home" />
        <MyMap />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    maxWidth: '100%',
  },
  image: {
    width: 42,
    height: 60,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  }
});
