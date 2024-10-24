import React, { Component } from 'react';

export default class App extends React.Component {

  state = {
    screen: "list",
    detailId: 0,
    pietanze:
      [
        {
          id: 0,
          nome: 'Pietanza1',
          descrizioneBreve: 'Lorem ipsum dolor sit.',
          descrizioneLunga: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ad quas quis rerum ipsa fugit ipsam exercitationem ducimus blanditiis nesciunt harum!',
        },
        {
          id: 1,
          nome: 'Pietanza2',
          descrizioneBreve: 'Lorem ipsum dolor sit.',
          descrizioneLunga: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ad quas quis rerum ipsa fugit ipsam exercitationem ducimus blanditiis nesciunt harum!',
        },
        {
          id: 2,
          nome: 'Pietanza3',
          descrizioneBreve: 'Lorem ipsum dolor sit.',
          descrizioneLunga: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ad quas quis rerum ipsa fugit ipsam exercitationem ducimus blanditiis nesciunt harum!',
        },
        {
          id: 3,
          nome: 'Pietanza4',
          descrizioneBreve: 'Lorem ipsum dolor sit.',
          descrizioneLunga: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ad quas quis rerum ipsa fugit ipsam exercitationem ducimus blanditiis nesciunt harum!',
        }]
  }

  render() {
    switch (this.state.screen) {
      case "list":
        return this.listaPietanze()
      case "detail":
        return this.dettaglioPietenza(this.state.detailId)
      default:
        return <div>Schermata non riconosciuta</div>
    }
  }

  handleShowDetails(id) {
    this.setState({
      screen: "detail",
      detailId: id,
    });
  }

  handleBackToList() {
    this.setState({
      screen: "list",
    })
  }

  listaPietanze() {
    return <ul>
      {this.state.pietanze.map((p) => this.itemPietanza(p))}
    </ul>
  }

  itemPietanza(pietanza) {
    return <li key={pietanza.id}>
      <h3>{pietanza.nome}</h3>
      <p>{pietanza.descrizioneBreve}</p>
      <button onClick={() => this.handleShowDetails(pietanza.id)}>Details</button>
    </li>
  }

  dettaglioPietenza(id) {
    let pietanza = this.state.pietanze.find((p) => p.id == id)
    return <div>
      <p>{pietanza.id}</p>
      <h2>{pietanza.nome}</h2>
      <p>{pietanza.descrizioneBreve}</p>
      <p>{pietanza.descrizioneLunga}</p>
      <button onClick={() => this.handleBackToList()}>Back</button>
    </div>
  }


}
