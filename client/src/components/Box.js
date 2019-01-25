import React from 'react'
import MultiRef from 'react-multi-ref';


// takes the num of boxes/cells to be produced
class Box extends React.Component{
    constructor(props) {
		super(props)
        this.state = {
        }
	}

    renderBoxes(i) {
      if (this.props.toRender) {
        let { toRender, stopsColors, legsColors } = this.props;
        return toRender.map((obj, i) => {
          let hasStopColor = (() => {
            if (!stopsColors || !stopsColors.length || !stopsColors.includes(i)) return false;
            return true;
          })();
          let hasLegColor = (() => {
            if (!legsColors || !legsColors.length || !legsColors.includes(i)) return false;
            return true;
          })();
          return (
              <div
              className={`box ${hasStopColor ? " stop-color" : ""} ${hasLegColor ? "leg-color": ""}`}
              key={i}
              />)
        });
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
