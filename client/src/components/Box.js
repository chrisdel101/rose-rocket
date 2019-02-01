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
            <div
            className={`box ${hasStopColor ? "stop-color" : ""} ${hasLegColor ? " leg-color" : ""} ${hasCompletionColor ? "complete-color" : ""}`}
            key={i}
            />)
    }
    renderBoxes(i) {
        if (this.props.toRender) {
            let { toRender } = this.props
          return toRender.map((obj, i) => {
              if(!this.state.colored){
                  return this.boxesWcolorLogic(i)
              } else if(this.state.colored){
                  return this.boxesWremoveColorLogic()
              }
          });
          // let opposite = !this.state.color
          // console.log(opposite)
          // this.setState({color:opposite})
        }
    }
    boxesWcolorLogic(i){
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
    boxesWremoveColorLogic(){

    }

    render() {
      console.log(this.props)
        if (this.props.toRender && this.props.toRender.length) {
          return <React.Fragment>{this.renderBoxes()}</React.Fragment>;
        } else {
          return <div>No Boxes yet!</div>;
        }
    }
}

export default Box
