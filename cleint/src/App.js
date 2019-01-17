import React, {
	Component
} from "react";
import "./App.css";

class App extends Component {
	constructor(props) {
		super(props);
		// Don't call this.setState() here!
		this.state = {
			stops: [],
			routesToCall: ["/legs", "/stops"]
		};
		this.RenderMarkup = this.RenderMarkup.bind(this);
	}
    componentDidMount() {
        // Call our fetch function below once the component mounts
      this.callBackendAPI()
        .then(res => {
            console.log(res)
            this.setState({ stops: res.stops })
        })
        .catch(err => console.log(err));

    }
      // Fetches our GET route from the Express server. (Note the route we are fetching matches the GET route from server.js
    callBackendAPI = async () => {
      const response = await fetch('/stops');
      console.log(response)
      const body = await response.json();


      if (response.status !== 200) {
        throw Error(body.message)
      }
      return body;
  }

	RenderMarkup() {
		// check data not null or rerender if null
		if(this.state.stops) {
        			return (
                        <div className="App">
                          {" "}
                          <header className="App-header">
                            {" "}
                            <h1 className="App-title"> Welcome to React </h1>
                            {console.log(this.state)}
                          </header>{" "}
                          <p className="App-intro"> hello </p>{" "}
                        </div>
                        )
    	} else {
    		return null;
    	}
    }

        render() {

        	return (<this.RenderMarkup /> )
        }
}

export default App;
