import React, { useState } from 'react';
import Dish from './models/Dish';
import DishDetails from './components/DishDetails';
import DishList from './components/DishList';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';

export default function App() {

  const sampleDishes = Dish.getSampleDishes()
  const [page, setPage] = useState("list")
  const [dishes, setDishes] = useState(sampleDishes)
  const [selectedMealId, setSelectedMealId] = useState(sampleDishes[0].id)

  const handleBackToList = () => {
    setPage("list")
  }

  const handleDeleteById = (id) => {
    const newDishes = dishes.filter((m) => m.id !== id)
    setDishes(newDishes)
    setPage("list")
  }

  const handleShowDetails = (id) => {
    setPage("detail")
    setSelectedMealId(id)
  }

  switch (page) {
    case "list":
      return (
        <SafeAreaProvider>
          <SafeAreaView style={{flex: 1}}>
            <DishList
              dishes={dishes}
              handleShowDetails={handleShowDetails}
            />
          </SafeAreaView>
        </SafeAreaProvider>
      )
    case "detail":
      return (

        <SafeAreaProvider>
          <SafeAreaView style={{flex: 1}}>
            <DishDetails
              dish={dishes.find(m => m.id === selectedMealId)}
              handleGoBack={handleBackToList}
              handleDelete={handleDeleteById}
            />
          </SafeAreaView>
        </SafeAreaProvider>
      )
    }

}

