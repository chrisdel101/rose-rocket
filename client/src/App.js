import React, { Component } from 'react'
import './App.css'
import Grid from './components/Grid'

const plotSets = {
  1: {
    plots: [
      { x: 5, y: 5 },
      { x: 8, y: 10 },
      { x: 12, y: 14 },
      { x: 13, y: 15 }
    ],
    plotColor: 'green',
    lineColor: 'yellow'
  },
  2: {
    plots: [{ x: 5, y: 5 }, { x: 6, y: 5 }, { x: 8, y: 7 }, { x: 14, y: 9 }],
    plotColor: 'blue',
    lineColor: 'red'
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
