import React from 'react';
import Dish from './models/Dish';
import MealsListItem from './components/MealsListItem';
import MealDetails from './components/MealDetails';
import './css/index.css'

class App extends React.Component {

  constructor(props) {
    super(props)
    const sampleDishes = Dish.getSampleDishes()
    this.state = {
      page: "list", // List or Detail
      meals: sampleDishes,
      selectedMealId: sampleDishes[0].id
    }
  }

  render() {
    switch (this.state.page) {
      case "list":
        return (
          <section>
            <h1>View: List</h1>
            {this.renderList()}
          </section>
        )
      case "detail":
        return (
          <section>
            <h1>View: Detail</h1>
            <MealDetails 
              meal={this.state.meals.find(m => m.id === this.state.selectedMealId )} 
              onGoBack={() => this.handleBackToList()} 
              onDelete={(id) => this.handleDeleteById(id)}  
            />
          </section>
        )
      default:
        return (
          <section>
            <h1>Error - Page Not Found</h1>
          </section>
        )
    }
  }

  renderList() {
    return (
      <ul>
        {this.state.meals.map(meal => (
          <MealsListItem key={meal.id} data={meal} onDetail={(id) => this.handleViewDetails(id)} />
        ))}
      </ul>
    )
  }


  handleViewDetails(id) {
    this.setState({
      page: "detail",
      selectedMealId: id,
    })
  }

  handleBackToList() {
    this.setState({
      page: 'list'
    })
  }

  handleDeleteById(id) {
    const newMeals = this.state.meals.filter((m) => m.id !== id)

    this.setState({
      meals: newMeals,
      selectedMealId: newMeals[0].id,
      page: 'list',
    })
  }

}

export default App;
