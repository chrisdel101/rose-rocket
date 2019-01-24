import React from 'react'
import MultiRef from 'react-multi-ref';


// takes the num of boxes/cells to be produced
class Box extends React.Component{
    constructor(props) {
		super(props)
        this.state = {
        }
        this._items = new MultiRef();
	}

    renderBoxes(i) {
      if (this.props.toRender) {
        let { toRender, toAdd } = this.props;
        return toRender.map((obj, i) => {
          let hasColor = (() => {
            if (!toAdd || !toAdd.length || !toAdd.includes(i)) return false;
            return true;
          })();
          return (
              <div
              className={`box ${hasColor ? " background-color" : ""}`}
              key={i}
              />)
        });
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
