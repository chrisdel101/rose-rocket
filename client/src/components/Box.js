import React from 'react'


// takes the num of boxes/cells to be produced
class Box extends React.Component{
    constructor(props) {
		super(props)
        this.state = {
            allColored: false,
            counter: 0
        }
	}
    renderBoxes(i) {
        if (this.props.toRender) {
            let { toRender } = this.props
          return toRender.map((obj, i) => {
              if(!this.state.allColored){
                  return this.allColorsRemoveLogic(i)
              } else if(this.state.allColored){
                  return this.allColorsAddLogic(i)
              }
          });
        }
    }
    toggleColor(){

            this.state.allColored = !this.state.allColored
            console.log('opposite', this.state.allColored)
            this.setState({
                allColored: this.state.allColored
            })
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
    boxesColorLogic(i){
        // console.log('color')
        let {  stopsColor, legsColor, completeColor } = this.props;
        let hasStopColor = (() => {
          if (!stopsColor || !stopsColor.length || !stopsColor.includes(i)) return false;
          return true
        })();
        let hasLegColor = (() => {
               if (!legsColor || !legsColor.length || !legsColor.includes(i)) return false;
               return true;
             })();
        let hasCompletionColor = (() => {
               if (!completeColor || !completeColor.length || !completeColor.includes(i)) return false;
               return true;
             })();
        return <this.BoxMarkup hasStopColor={hasStopColor} hasLegColor={hasLegColor} hasCompletionColor={hasCompletionColor} i={i} key={i}/>
    }
    boxesRemoveColorLogic(i){
        // console.log('uncolor')
        // console.log('uncolor')
        let {  stopsColor, legsColor, completeColor } = this.props;
        let hasStopColor = (() => {
          if (stopsColor && stopsColor.includes(i)) return false;

        })();
        let hasLegColor = (() => {
               if (legsColor && legsColor.includes(i)) return false;

             })();
        let hasCompletionColor = (() => {
               if (completeColor && completeColor.includes(i)) return false;
             })();
        return <this.BoxMarkup hasStopColor={hasStopColor} hasLegColor={hasLegColor} hasCompletionColor={hasCompletionColor} i={i} key={i}/>
    }
    BoxMarkup(props){
        return (
            <div className={`box ${props.hasStopColor ? "stop-color" : ""} ${props.hasLegColor ? " leg-color" : ""} ${props.hasCompletionColor ? "complete-color" : ""}`}></div>
        )
    }
    componentDidUpdate(prevProps,prevState){
        if(this.props.allColored !== prevProps.allColored){
            this.toggleColor()
            console.log(this.state.allColored)
        }
        // check if this props is dif than last
        if(this.props.count !== prevProps.count){
            // console.log(this.props.count)
            // console.log(this.state.counter)
            // if state count is not yet updated
            if(this.state.counter !== this.props.count){
                console.log('toggle')
                // update by one
                this.toggleColor()
                this.setState({
                    counter: this.props.count
                })
            } else {
                console.log(this.state.counter)
                console.log(this.props.count)
            }

            console.log('update')
        }
    }
    componentDidMount(){
        // if(this.props.count >= 0){
        //     this.setState({
        //         counter: this.props.count
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
