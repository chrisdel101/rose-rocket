import React, { Component } from 'react'
import './App.css'
import Grid from './components/Grid'

class App extends Component {
  render() {
    return (
      <Grid
        setGraphSize={{ x: 20, y: 20 }}
        plotObjs={[
          { x: 5, y: 5 },
          { x: 6, y: 10 },
          { x: 12, y: 14 },
          { x: 10, y: 10 }
        ]}
        cursors={[{ color: 'blue', coords: { x: 10, y: 10 } }]}
        // legToColorID="AB"
        colorAllPoints={true}
        lineColor="red"
        // cursor={''}
      />
    )
  }
}

export default App
