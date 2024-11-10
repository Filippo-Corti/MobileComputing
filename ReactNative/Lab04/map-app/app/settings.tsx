import { Image, Text, View, StyleSheet } from "react-native";

export default function Settings() {
  return (
    <View style={styles.container}>
      <Text>Edit app/settings.tsx to edit this screen.</Text>
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
