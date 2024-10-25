import React from 'react';
import './css/index.css'
import Dish from './models/Dish';

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

  state = {}

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
            {this.renderDetail()}
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
        {this.state.meals.map((meal) => this.renderListItem(meal))}
      </ul>
    )
  }

  renderListItem(meal) {
    return (
      <li key={meal.id}>
        <h3>{meal.name}</h3>
        <p>{meal.shortDescription}</p>
        <button onClick={() => this.handleViewDetails(meal.id)}>Details</button>
      </li>
    ) 
  }

  handleViewDetails(id) {
    this.setState({
      page: "detail",
      selectedMealId: id,
    })
  }

  renderDetail() {
    console.log(this.state)
    const selectedMeal = this.state.meals.find((m) => m.id === this.state.selectedMealId)

    return (
      <div>
        <p>{selectedMeal.id}</p>
        <h2>{selectedMeal.name}</h2>
        <p>{selectedMeal.shortDescription}</p>
        <p>{selectedMeal.longDescription}</p>
        <button onClick={() => this.handleBackToList()}>Go Back</button>
      </div>
    )
  }

  handleBackToList() {
    this.setState({
      page: 'list'
    })
  }

}

export default App;
