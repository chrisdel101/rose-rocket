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
            xInputVal: '',
            yInputVal: ''
		};
		// this.RenderMarkup = this.RenderMarkup.bind(this);
	}
    componentDidMount() {
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
    // takes a integer string?
    move(x,y){
        var start = document.querySelector('.box-container:nth-of-type(39801)')
        start.style["grid-column-end"] = x
        start.style["grid-row-end"] = this.adjustRowMovement(y)
        this.setState({
            position: {
                x: x,
                y: y
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
    updateXvalue(evt) {
        this.setState({
          xInputVal: evt.target.value
        })
    }
    updateYvalue(evt) {
        this.setState({
          yInputVal: evt.target.value
        })
    }
    handleSubmit(event) {
        console.log(`x: ${this.state.xInputVal}`)
        console.log(`y: ${this.state.yInputVal}`)
        this.move(this.state.xInputVal, this.state.yInputVal)
      // alert('A name was submitted: ' + this.state.value);
      event.preventDefault();
    }
        render() {
            // console.log(this.state.xInputVal)
            // console.log(this.state.yInputVal)
        	return(
                <div>
                    <div className="grid-container">
                    <div className="grid">
                    <Box num={40000} />
                    </div>

                    </div>
                    <form onSubmit={this.handleSubmit.bind(this)}>
                         X-coords: <input className="x-coord" type="text" value={this.state.xInputVal} onChange={evt => this.updateXvalue(evt)} >
                         </input>
                         Y-coords: <input className="y-coord" type="text" value={this.state.yInputVal} onChange={evt => this.updateYvalue(evt)}  ></input>
                         <input type="submit" value="Submit"></input>

                    </form>
                </div>
            )
        }
}

// <div className="cursor">&#11044;</div>
export default Grid
