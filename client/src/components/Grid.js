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

        render() {

        	return(
                <div className="grid">

                    <Box num={100} />
                </div>
            )
        }
}

// <div className="cursor">&#11044;</div>
export default Grid
