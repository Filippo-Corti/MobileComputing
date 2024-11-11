import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import ViewModel from './viewmodel/ViewModel';

export default function App() {

  const [order, setOrder] = useState({
    title: "Loading Data..."
  });
  const ORDER_ID = 1;

  const fetchData = async () => {
    try {
      console.log("Fetching Data...");
      const orderData = await ViewModel.loadOrderData(ORDER_ID);
      console.log("Fetched Data", orderData);
      setOrder(orderData);
    } catch (err) {
      console.log("Error...", err);
    }
  }

  useEffect(() => {fetchData()}, []);

  return (
    <View style={styles.container}>
      <Text>{order.title}</Text>
      <Text>{order.author}</Text>
      <Text>{order.publisher}</Text>
      <Text>{order.status}</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
