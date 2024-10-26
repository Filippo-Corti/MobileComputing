import React, { useState } from 'react';
import Dish from './models/Dish';
import DishDetails from './components/DishDetails';
import './css/index.css'
import DishList from './components/DishList';

function App() {

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
        <DishList
          dishes={dishes}
          handleShowDetails={handleShowDetails}
        />
      )
    case "detail":
      return (
        <DishDetails
          dish={dishes.find(m => m.id === selectedMealId)}
          handleGoBack={handleBackToList}
          handleDelete={handleDeleteById}
        />
      )
    default:
      return (
        <section>
          <h1>Error - Page Not Found</h1>
        </section>
      )
  }
}

export default App;
