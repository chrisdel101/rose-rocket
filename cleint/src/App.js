import React, {Component} from "react";
import "./App.css";

class App extends Component {
	constructor(props) {
		super(props);
		// Don't call this.setState() here!
		this.state = {
			legs: null,
			routesToCall: ["/legs", "/stops"]
		};
		this.RenderMarkup = this.RenderMarkup.bind(this);
	}

	componentDidMount() {
		// Call our fetch function below once the component mounts
		this.callBackendAPI()
		// .then(res => {
		//   console.log(res.legs);
		//   this.setState({data: res.legs});
		// })
		// .catch(err => console.log(err));
	}
	// Fetches our GET route from the Express server. (Note the route we are fetching matches the GET route from server.js
	//callBackendAPI = async () => {
	// 	try {
	//let [legs, stops] = await Promise.all([fetch("/legs"), fetch("/stops")])
	// 		legs.then(i => console.log(i))
	// 	} catch (err) {
	// 		console.log(err);
	// 	}
	// };
	callBackendAPI() {
		fetch("/stops")
	}

	RenderMarkup() {
		// check data not null or rerender if null
		if (this.state.data) {
			return (< div className = "App" > <header className = "App-header" > <h1 className = "App-title" > Welcome to React < /h1>
				{
					console.log(this.state.data[0].name)
				} <
				/header > <p className = "App-intro" > {
				this.state.data[0].name
			} < /p> < /div >);
		} else {
			return null;
		}
	}

	render() {
		return <this.RenderMarkup >
		;
	}
}

export default App;
