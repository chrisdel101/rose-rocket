import React, {Component} from "react"
import "../App.css";
import Box from './Box'

class Grid extends Component {
	constructor(props) {
		super(props);
		// Don't call this.setState() here!
		this.state = {
            legs: [],
			stops: [],
            position: {x: 0, y: 0},
            tempX: '0',
            tempY: '0',
            totalBoxes: 40000,
        }
        // this.boxRefs = React.createRef();

		// this.RenderMarkup = this.RenderMarkup.bind(this);
	}
    componentDidMount() {
        // this.setState:
        // numsToSpread: Array.from({length: this.state.totalBoxes}, (v, i) => i)
        // Call our fetch function below once the component mounts
      this.callStops()
        .then(res => {
            this.setState({ stops: res.stops })
        })
        .catch(err => console.log(err));
      this.callLegs()
        .then(res => {
            this.setState({ legs: res.legs })
        })
        .catch(err => console.log(err));

    }
    callLegs = async () => {
        const response = await fetch('/legs');
        const body = await response.json();

        if (response.status !== 200) {
        throw Error(body.message)
        }
        return body
    }
    callStops = async () => {
        const response = await fetch('/stops');
        const body = await response.json();

        if (response.status !== 200) {
          throw Error(body.message)
        }
        return body
    }
    getState(){
        console.log('temp x', this.state.tempX)
        console.log('temp y', this.state.tempY)

        console.log('real x', this.state.position.x)
        console.log('real y', this.state.position.y)
    }
    move(xVal,yVal){
        console.log('x', this.state.position.x)
        console.log('y', this.state.position.y)
        var startStop = document.querySelector('.box-container:nth-of-type(39801)')
        startStop.style["grid-column-start"] = xVal
        startStop.style["grid-column-end"] = xVal
        startStop.style["grid-row-start"] = this.adjustRowMovement(yVal)
        startStop.style["grid-row-end"] = this.adjustRowMovement(yVal)
        // add input to state val

        // xVal = parseInt(this.state.position.x) + parseInt(xVal)
        xVal = 1 + parseInt(xVal)
        // yVal= parseInt(this.state.position.y) + parseInt(yVal)
        yVal= 1 + parseInt(yVal)
            console.log('y', this.state.position.y)
            console.log('x', this.state.position.x)
            this.setState({
                position: {
                    x: xVal,
                    y: yVal
                }
        })
    }
    adjustRowMovement(y){
        let total = 200
        let adjust = total - y
        return adjust
    }
	RenderTextMarkup() {
		// check data not null or rerender if null
		if(this.state.legs[0]) {
        			return (
                        <div className="App">
                          {" "}
                          <header className="App-header">
                            {" "}
                            <h1 className="App-title"> Welcome to React </h1>
                            {console.log(this.state.legs[0].name)}
                          </header>{" "}
                          <p className="App-intro"> {this.state.legs[0].name} </p>{" "}
                        </div>
                        )
    	} else {
    		return null;
    	}
    }
    // hold vals in input until next entered
    updateXvalue(evt) {
        console.log(evt.target.value)
        this.setState({
          tempX: evt.target.value
        })
        // console.log(`temp x: ${this.state.tempX}`)

    }
    updateYvalue(evt) {
        console.log(evt.target.value)
        this.setState({
          tempY: evt.target.value
        })
        console.log(`temp y: ${this.state.tempY}`)

    }
    handleSubmit(event) {
        // console.log(`temp x: ${this.state.tempX}`)
        // console.log(`temp y: ${this.state.tempY}`)
        this.move(this.state.tempX, this.state.tempY)
      // alert('A name was submitted: ' + this.state.value);
      event.preventDefault();
    }
    render() {
        // console.log(this.state.tempX)
        // console.log(this.state.tempY)
    	return(
            <div>
                <div className="grid-container">
                <div className="grid">
                    <Box totalBoxes={this.state.totalBoxes} />
                    </div>
                </div>
                <form onSubmit={this.handleSubmit.bind(this)}>
                     X-coords: <input className="x-coord" type="text" value={this.state.tempX} onChange={evt => this.updateXvalue(evt)} >
                     </input>
                     Y-coords: <input className="y-coord" type="text" value={this.state.tempY} onChange={evt => this.updateYvalue(evt)}  ></input>
                     <input type="submit" value="Submit" onMouseOver={this.getState.bind(this   )}></input>

                </form>
            </div>
        )
    }
}

// <div className="cursor">&#11044;</div>
export default Grid
