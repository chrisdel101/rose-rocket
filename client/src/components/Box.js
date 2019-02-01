import React from 'react'


// takes the num of boxes/cells to be produced
class Box extends React.Component{
    constructor(props) {
		super(props)
        this.state = {
            colored: false
        }
	}
    _renderMarkup(hasStopColor,hasLegColor,hasCompletionColor,i){
        return(
            <div
            className={`box ${hasStopColor ? "stop-color" : ""} ${hasLegColor ? " leg-color" : ""} ${hasCompletionColor ? "complete-color" : ""}`}
            key={i}
            />)
    }
    renderBoxes(i) {
        if (this.props.toRender) {
          let { toRender, stopsColor, legsColor, completeColor } = this.props;
          return toRender.map((obj, i) => {
              // if false add color
              if(!this.state.colored){
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
                  return this._renderMarkup(hasCompletionColor, hasLegColor, hasCompletionColor,i)
                  // if true remove color
              }
          //     else if(this.state.colored){
          //         let hasStopColor = (() => {
          //             if (!stopsColor || !stopsColor.length || stopsColor.includes(i)) return true;
          //             return false
          //         })();
          //         let hasLegColor = (() => {
          //             if (!legsColor || !legsColor.length || legsColor.includes(i)) return true;
          //             return false;
          //         })();
          //         let hasCompletionColor = (() => {
          //             if (!completeColor || !completeColor.length || completeColor.includes(i)) return true;
          //             return false;
          //         })();
          //         this._renderMarkup(hasCompletionColor, hasLegColor, hasCompletionColor,i)
              // }
          });
          // let opposite = !this.state.color
          // console.log(opposite)
          // this.setState({color:opposite})
        }
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
