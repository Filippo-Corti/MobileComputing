import { Stack } from "expo-router";
import { Image, Text, View, StyleSheet } from "react-native";

export default function Index() {
  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'My home',
          headerTitleStyle: {
            color: 'green',
          },
          headerTitle: (props) => <LogoTitle title={"My home"} />,
        }}
      />
      <Text>Edit app/index.tsx to edit this screen.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
