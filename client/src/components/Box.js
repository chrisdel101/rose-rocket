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
            legColorsCounter: 0
        }
	}
    renderBoxes(i) {
        if (this.props.toRender) {
            let { toRender } = this.props
          return toRender.map((obj, i) => {
              let result
              if(!this.state.allColored){
                  result = this.allColorsRemoveLogic(i)
              } else if(this.state.allColored){
                  result = this.allColorsAddLogic(i)
              }
              if(!this.state.legColored){
                  // console.log('top')
                  result = this.legColorsRemoveLogic(i)
              } else if(this.state.legColored){
                  // console.log('run bottom')
                  result = this.legColorsAddLogic(i)
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

            } else if(type === 'comlpete'){
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
        return <this.BoxMarkup hasStopColor={hasLegColor} key={i}/>
    }
    legColorsRemoveLogic(i){
        let {  legsColor } = this.props;
        legsColor  = legsColor.leg
        let hasLegColor = (() => {
              if (legsColor && legsColor.includes(i)) return false;
        })();
        return <this.BoxMarkup hasStopColor={hasLegColor} key={i}/>
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
            // console.log(this.props.count)
            // console.log(this.state.allColorsCounter)
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
        if(this.props.legColorsCounter !== prevProps.legColorsCounter){
            // console.log(this.props.count)
            // console.log(this.state.legColorsCounter)
            // if state count is not yet updated
            if(this.state.legColorsCounter !== this.props.legColorsCounter){
                console.log('toggle leg')
                // update by one
                this.toggleColor('leg')
                this.setState({
                    legColorsCounter: this.props.legColorsCounter
                })
                setTimeout(() => {
                    console.log(this.state.legColorsCounter)

                })
            } else {
                console.log(this.state.legColorsCounter)
                console.log(this.props.legColorsCounter)
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
