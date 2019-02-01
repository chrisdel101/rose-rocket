import React from 'react'


// takes the num of boxes/cells to be produced
class Box extends React.Component{
    constructor(props) {
		super(props)
        this.state = {
            colored: false
        }
	}
    boxMarkup(hasStopColor, hasLegColor, hasCompletionColor,i){
        return (
            <div className={`box ${hasStopColor ? "stop-color" : ""} ${hasLegColor ? " leg-color" : ""} ${hasCompletionColor ? "complete-color" : ""}`} key={i}></div>
            )
    }
    renderBoxes(i) {
        if (this.props.toRender) {
            let { toRender } = this.props
          return toRender.map((obj, i) => {
              if(!this.props.colored){
                  return this.boxesColorLogic(i)
              } else if(this.props.colored){
                  return this.boxesRemoveColorLogic()
              }
          });
        }
    }
    toggleColor(){

            this.state.colored = !this.state.colored
            console.log('opposite', this.state.colored)
            this.setState({
                colored: this.state.colored
            })
            // if(this.state.colored === false){
            //     console.log('opposite', !this.state.colored)
            //     this.setState({
            //         colored: true
            //     })
            // } else if(this.state.colored === true){
            //     console.log('opposite', !this.state.colored)
            //     this.setState({
            //         colored: false
            //     })
            // }


    }
    boxesColorLogic(i){
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
        return this.boxMarkup(hasStopColor, hasLegColor, hasCompletionColor,i)
    }
    boxesRemoveColorLogic(i){
        // console.log(this.props.color)
        // console.log('uncolor')
        let {  stopsColor, legsColor, completeColor } = this.props;
        let hasStopColor = (() => {
          if (!stopsColor || !stopsColor.length || stopsColor.includes(i)) return false;
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
        return this.boxMarkup(hasStopColor, hasLegColor, hasCompletionColor,i)
    }
    componentDidUpdate(prevProps,prevState){
        // console.log('props',this.props.colored)
        // console.log('prv props',prevProps.colored)
        // console.log('prv state', prevState.colored)
        if(this.props.colored !== prevProps.colored){
            // console.log('props IN',this.props.colored)
            // console.log('prv props IN',prevProps.colored)
            // console.log('prv state IN', prevState.colored)
            this.toggleColor()
            console.log(this.state.colored)
        }
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
