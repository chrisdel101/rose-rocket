import React, { Component } from 'react'
import './App.css'
import Grid from './components/Grid'

class App extends Component {
  render() {
    return (
      <Grid
        setGraphSize={{ x: 20, y: 20 }}
        plotObjs={[{ x: 5, y: 5 }, { x: 6, y: 10 }]}
        colorGraph={true}
      />
    )
  }
}

export default App
