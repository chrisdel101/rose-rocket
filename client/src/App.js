import React, { Component } from 'react'
import './App.css'
import Grid from './components/Grid'

class App extends Component {
  render() {
    return (
      <Grid
        setGraphSize={{ x: 50, y: 50 }}
        plotObjs={[{ x: 5, y: 5 }, { x: 6, y: 10 }]}
      />
    )
  }
}

export default App
