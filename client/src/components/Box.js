import React from 'react'
import utils from './grid_utils'

// takes the num of boxes/cells to be produced
class Box extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      allColored: false,
      legColored: false,
      completeColored: false,
      allColorsCounter: 0,
      legColorsCounter: 0,
      completedColorsCounter: 0,
      previousLegIndex: ''
    }
    this.BoxMarkup = this.BoxMarkup.bind(this)
  }
  renderBoxes(i) {
    console.log(this.props)
    if (this.props.toRender) {
      const { toRender } = this.props
      return toRender.map((obj, i) => {
        let result
        switch (this.props.type) {
          case 'all':
            if (!this.state.allColored) {
              result = this.allColorsRemoveLogic(i)
            } else if (this.state.allColored) {
              result = this.allColorsAddLogic(i)
            }
            break
          case 'leg':
            if (!this.state.legColored) {
              result = this.legColorsRemoveLogic(i)
            } else if (this.state.legColored) {
              result = this.legColorsAddLogic(i)
            }
            break
          case 'complete':
            if (!this.state.completeColored) {
              result = this.completedColorsRemoveLogic(i)
            } else if (this.state.completeColored) {
              result = this.completedColorsAddLogic(i)
            }
            break
          default:
            // on first render just run markup
            result = <this.BoxMarkup key={i} id={i} />
            break
        }
        return result
      })
    }
  }
  toggleColor(type) {
    if (type === 'all') {
      console.log('opposite', this.state.allColored)
      this.setState({
        allColored: utils._toggleState(this.state.allColored)
      })
      console.log(this.state.allColored)
    } else if (type === 'leg') {
      console.log('opposite', this.state.legColored)
      this.setState({
        legColored: utils._toggleState(this.state.legColored)
      })
    } else if (type === 'complete') {
      console.log('opposite', this.state.completeColored)
      this.setState({
        completeColored: utils._toggleState(this.state.completeColored)
      })
    }
  }
  allColorsAddLogic(i) {
    let { stopsColor } = this.props
    // console.log(stopsColor)
    let hasStopColor = (() => {
      if (!stopsColor || !stopsColor.length || !stopsColor.includes(i))
        return false
      return true
    })()
    return <this.BoxMarkup hasStopColor={hasStopColor} key={i} id={i} />
  }
  allColorsRemoveLogic(i) {
    let { stopsColor } = this.props
    console.log(stopsColor)
    let hasStopColor = (() => {
      if (stopsColor && stopsColor.includes(i)) return false
    })()
    return <this.BoxMarkup hasStopColor={hasStopColor} key={i} id={i} />
  }
  legColorsAddLogic(i) {
    let { legsColor } = this.props
    legsColor = legsColor.leg
    let hasLegColor = (() => {
      if (!legsColor || !legsColor.length || !legsColor.includes(i))
        return false
      return true
    })()
    return <this.BoxMarkup hasLegColor={hasLegColor} key={i} id={i} />
  }
  legColorsRemoveLogic(i) {
    let { legsColor } = this.props
    legsColor = legsColor.leg
    let hasLegColor = (() => {
      if (legsColor && legsColor.includes(i)) return false
    })()
    return <this.BoxMarkup hasLegColor={hasLegColor} key={i} id={i} />
  }
  completedColorsAddLogic(i) {
    let { completeColor } = this.props
    let hasCompletionColor = (() => {
      if (!completeColor || !completeColor.length || !completeColor.includes(i))
        return false
      return true
    })()
    return (
      <this.BoxMarkup hasCompletionColor={hasCompletionColor} key={i} id={i} />
    )
  }
  completedColorsRemoveLogic(i) {
    let { completeColor } = this.props
    let hasCompletionColor = (() => {
      if (completeColor && completeColor.includes(i)) return false
    })()
    return (
      <this.BoxMarkup hasCompletionColor={hasCompletionColor} key={i} id={i} />
    )
  }

  BoxMarkup(input) {
    let idStr = `id${input.id}`
    return (
      <div
        id={idStr}
        key={input.id}
        className={`box ${
          input.hasStopColor ? `stop-color${this.props.selectedDriver}` : ''
        } ${input.hasLegColor ? `leg-color${this.props.selectedDriver}` : ''} ${
          input.hasCompletionColor
            ? `complete-color${this.props.selectedDriver}`
            : ''
        }`}
      />
    )
  }
  componentDidUpdate(prevProps, prevState) {
    // check if this props is dif than last - to stop it firing over and over
    if (this.props.allColorsCounter !== prevProps.allColorsCounter) {
      console.log('here')
      // if state count is not yet updated
      if (this.state.allColorsCounter !== this.props.allColorsCounter) {
        console.log('toggle')
        this.toggleColor('all')
        this.setState({
          // update by one
          allColorsCounter: this.props.allColorsCounter
        })
      } else {
        console.error('And error in the all index logic')
      }
    }
    // check for change - if counter diff then there is a change
    if (this.props.legColorsCounter !== prevProps.legColorsCounter) {
      // if new leg, index will be diff
      if (this.props.legsColor.index !== this.state.previousLegIndex) {
        console.log('change leg')
        // udpate index
        this.setState({
          previousLegIndex: this.props.legsColor.index,
          legColored: true
        })
        // if same leg, index will match previous then just toggle off
      } else if (this.props.legsColor.index === this.state.previousLegIndex) {
        console.log('toggle leg')
        this.toggleColor('leg')
      } else {
        console.error('An error in the leg index logic')
      }
    }
    if (
      this.props.completedColorsCounter !== prevProps.completedColorsCounter
    ) {
      if (
        this.state.completedColorsCounter !== this.props.completedColorsCounter
      ) {
        // update by one
        this.toggleColor('complete')
        this.setState({
          completedColorsCounter: this.props.completedColorsCounter
        })
      } else {
        console.error('An error in the complete index logic')
      }
    }
  }
  render() {
    // console.log(this.props)

    if (this.props.toRender && this.props.toRender.length) {
      return <React.Fragment>{this.renderBoxes()}</React.Fragment>
    } else {
      return <div>No Boxes yet!</div>
    }
  }
}

export default Box
