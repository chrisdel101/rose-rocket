import React, { Component } from 'react'
import './App.css'
import Grid from './components/Grid'

const plotSets = {
  1: {
    plots: [
      { x: 5, y: 5 },
      { x: 6, y: 10 },
      { x: 12, y: 14 },
      { x: 10, y: 10 }
    ],
    color: 'red',
    colored: true
  },
  2: {
    plots: [
      { x: 5, y: 5 },
      { x: 6, y: 10 },
      { x: 12, y: 14 },
      { x: 10, y: 10 }
    ],
    color: 'blue',
    colored: true
  }
}
class App extends Component {
  render() {
    return (
      <Grid
        setGraphSize={{ x: 20, y: 20 }}
        plotSets={plotSets}
        cursors={[{ color: 'blue', coords: { x: 10, y: 10 } }]}
        // legToColorID="AB"
        colorAllPoints={true}
        lineColor={''}
        // cursor={''}
      />
    )
  }
}

export default App
