import React, { Component } from 'react'
import './App.css'
import Grid from './components/Grid'

class App extends Component {
  render() {
    return <Grid setGraphSize={{ x: 20, y: 20 }} />
  }
}

export default App
