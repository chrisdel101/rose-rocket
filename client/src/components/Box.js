import React from 'react'


// takes the num of boxes/cells to be produced
class Box extends React.Component{
    constructor(props) {
		super(props)
        this.state = {
            allColored: false,
            legColored: false,
            completeColored: false,
            allColorsCounter: 0,
            legColorsCounter: 0,
            completedColorsCounter: 0,
            previousLegIndex: ""
        }
	}
    renderBoxes(i) {
        if (this.props.toRender) {
            let { toRender } = this.props
          return toRender.map((obj, i) => {
              let result
              switch(this.props.type){
                  case 'all':
                  // console.log(this.props.type)
                      if(!this.state.allColored){
                          result = this.allColorsRemoveLogic(i)
                      } else if(this.state.allColored){
                          result = this.allColorsAddLogic(i)
                      }
                  break
                  case 'leg':
                  // console.log(this.props.type)
                      if(!this.state.legColored){
                          // console.log('top')
                          result = this.legColorsRemoveLogic(i)
                          // this.setState({
                              //     previousLegIndex: this.props.legsColor.index
                              // })
                          } else if(this.state.legColored){
                              // if it's same index, remove the color
                              result = this.legColorsAddLogic(i)
                          }
                    break
                    case 'complete':
                    // console.log(this.props.type)
                        if(!this.state.completeColored){
                            result = this.completedColorsRemoveLogic(i)
                        } else if(this.state.completeColored){
                            result = this.completedColorsAddLogic(i)
                        }
                    break
              }
              return result
          });
        }
    }
    toggleColor(type){
            if(type === 'all'){
                this.state.allColored = !this.state.allColored
                console.log('opposite', this.state.allColored)
                this.setState({
                    allColored: this.state.allColored
                })

            } else if(type === 'leg'){
                this.state.legColored = !this.state.legColored
                console.log('opposite', this.state.legColored)
                this.setState({
                    legColored: this.state.legColored
                })

            } else if(type === 'complete'){
                this.state.completeColored = !this.state.completeColored
                console.log('opposite', this.state.completeColored)
                this.setState({
                    completeColored: this.state.completeColored
                })
            }
            // this.state.allColored = !this.state.allColored
            // console.log('opposite', this.state.allColored)
            // this.setState({
            //     allColored: this.state.allColored
            // })
            // if(this.state.allColored === false){
            //     console.log('opposite', !this.state.allColored)
            //     this.setState({
            //         allColored: true
            //     })
            // } else if(this.state.allColored === true){
            //     console.log('opposite', !this.state.allColored)
            //     this.setState({
            //         allColored: false
            //     })
            // }


    }
    allColorsAddLogic(i){
        let { stopsColor } = this.props;
        let hasStopColor = (() => {
          if (!stopsColor || !stopsColor.length || !stopsColor.includes(i)) return false;
          return true
        })();
        return <this.BoxMarkup hasStopColor={hasStopColor} key={i}/>
    }
    allColorsRemoveLogic(i){
        let {  stopsColor } = this.props;
        let hasStopColor = (() => {
          if (stopsColor && stopsColor.includes(i)) return false;
        })();
        return <this.BoxMarkup hasStopColor={hasStopColor} key={i}/>
    }
    legColorsAddLogic(i){
        let { legsColor } = this.props;
        legsColor  = legsColor.leg
        // console.log(legsColor)
        let hasLegColor = (() => {
           if (!legsColor || !legsColor.length || !legsColor.includes(i)) return false;
           return true;
        })();
        return <this.BoxMarkup hasLegColor={hasLegColor} key={i}/>
    }
    legColorsRemoveLogic(i){
        let {  legsColor } = this.props;
        legsColor  = legsColor.leg
        let hasLegColor = (() => {
              if (legsColor && legsColor.includes(i)) return false;
        })();
        return <this.BoxMarkup hasLegColor={hasLegColor} key={i}/>
    }
    completedColorsAddLogic(i){
        let { completeColor } = this.props;
        // console.log(legsColor)
        let hasCompletionColor = (() => {
           if (!completeColor || !completeColor.length || !completeColor.includes(i)) return false;
           return true;
         })();
        return <this.BoxMarkup hasCompletionColor={hasCompletionColor} key={i}/>
    }
    completedColorsRemoveLogic(i){
        let {  completeColor } = this.props;
        let hasCompletionColor = (() => {
           if (completeColor && completeColor.includes(i)) return false;
         })();
        return <this.BoxMarkup hasCompletionColor={hasCompletionColor} key={i}/>
    }

    BoxMarkup(props){
        return (
            <div className={`box ${props.hasStopColor ? "stop-color" : ""} ${props.hasLegColor ? " leg-color" : ""} ${props.hasCompletionColor ? "complete-color" : ""}`}></div>
        )
    }
    componentDidUpdate(prevProps,prevState){
        // if(this.props.allColored !== prevProps.allColored){
        //     this.toggleColor('all')
        //     console.log(this.state.allColored)
        // }
        //
        // if(this.props.legColored !== prevProps.legColored){
        //     this.toggleColor('leg')
        //     console.log(this.state.legColored)
        // }
        // if(this.props.completeColored !== prevProps.completeColored){
        //     this.toggleColor('')
        //     console.log(this.state.allColored)
        // }
        // if(this.props.completedColored !== prevProps.completedColored){
        //     this.toggleColor()
        //     console.log(this.state.allColored)
        // }
        // check if this props is dif than last - to stop it firing over and over
        if(this.props.allColorsCounter !== prevProps.allColorsCounter){

            // if state count is not yet updated
            if(this.state.allColorsCounter !== this.props.allColorsCounter){
                console.log('toggle')
                // update by one
                this.toggleColor('all')
                this.setState({
                    allColorsCounter: this.props.allColorsCounter
                })
            } else {
                console.log(this.state.allColorsCounter)
                console.log(this.props.allColorsCounter)
            }

            console.log('update')
        }
        // check for change - if counter diff then there is a change
        if(this.props.legColorsCounter !== prevProps.legColorsCounter){
            // if new leg, index will be diff
            if(this.props.legsColor.index !== this.state.previousLegIndex){
                console.log('change leg')
                // udpate index
                this.setState({
                    previousLegIndex: this.props.legsColor.index,
                    legColored: true
                })
                setTimeout(() => {
                    console.log(this.state)
                    console.log(this.props)

                })
                // if same leg, index will match previous
            } else if(this.props.legsColor.index === this.state.previousLegIndex){
                console.log('toggle leg')
                this.toggleColor('leg')
            } else {

                console.error("An error in the leg index logic")
            }

            console.log('update')
        }
        if(this.props.completedColorsCounter !== prevProps.completedColorsCounter){
            console.log(this.props)
            if(this.state.completedColorsCounter !== this.props.completedColorsCounter){
                console.log('toggle')
                // update by one
                this.toggleColor('complete')
                this.setState({
                    completedColorsCounter: this.props.completedColorsCounter
                })
            } else {

                console.error("An error in the leg index logic")
            }

            console.log('update')
        }

    }
    componentDidMount(){
        // if(this.props.count >= 0){
        //     this.setState({
        //         allColorsCounter: this.props.count
        //     })
        // }
    }

    render() {
      // console.log(this.props)
        if (this.props.toRender && this.props.toRender.length) {
          return <React.Fragment>{this.renderBoxes()}</React.Fragment>;
        } else {
          return <div>No Boxes yet!</div>;
        }
    }
}

export default Box
// boxesColorLogic(i){
//     // console.log('color')
//     let {  stopsColor, legsColor, completeColor } = this.props;
//     let hasStopColor = (() => {
//       if (!stopsColor || !stopsColor.length || !stopsColor.includes(i)) return false;
//       return true
//     })();
//     let hasLegColor = (() => {
//            if (!legsColor || !legsColor.length || !legsColor.includes(i)) return false;
//            return true;
//          })();
//     let hasCompletionColor = (() => {
//            if (!completeColor || !completeColor.length || !completeColor.includes(i)) return false;
//            return true;
//          })();
//     return <this.BoxMarkup hasStopColor={hasStopColor} hasLegColor={hasLegColor} hasCompletionColor={hasCompletionColor} i={i} key={i}/>
// }
// boxesRemoveColorLogic(i){
//     // console.log('uncolor')
//     // console.log('uncolor')
//     let {  stopsColor, legsColor, completeColor } = this.props;
//     let hasStopColor = (() => {
//       if (stopsColor && stopsColor.includes(i)) return false;
//
//     })();
//     let hasLegColor = (() => {
//            if (legsColor && legsColor.includes(i)) return false;
//
//          })();
//     let hasCompletionColor = (() => {
//            if (completeColor && completeColor.includes(i)) return false;
//          })();
//     return <this.BoxMarkup hasStopColor={hasStopColor} hasLegColor={hasLegColor} hasCompletionColor={hasCompletionColor} i={i} key={i}/>
// }
