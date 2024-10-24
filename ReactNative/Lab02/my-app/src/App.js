import React, { Component } from 'react';

export default class App extends React.Component {

  state = {
    screen: "list",
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
        return this.dettaglioPietenza(0)
      default:
        return <div>Schermata non riconosciuta</div>
    }
  }

  listaPietanze() {
    return <ul>
      {this.state.pietanze.map(this.itemPietanza)}
    </ul>
  }

  itemPietanza(pietanza) {
    return <li>
      <h3>{pietanza.nome}</h3>
      <p>{pietanza.descrizioneBreve}</p>
    </li>
  }

  dettaglioPietenza(id) {
    let pietanza = this.state.pietanze.find((p) => p.id == id)
    return <div>
      <p>{pietanza.id}</p>
      <h2>{pietanza.nome}</h2>
      <p>{pietanza.descrizioneBreve}</p>
      <p>{pietanza.descrizioneLunga}</p>
    </div>
  }

}
