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
            tempY: '0'
		};
		// this.RenderMarkup = this.RenderMarkup.bind(this);
        this.setStopsPosition = this.setStopsPosition.bind(this);

	}
    componentDidMount() {
        // call movemaker with stops on mount


        let startingCell = document.querySelector('.box-container:nth-of-type(39802)')
        this.setState({
            startingCell: startingCell
        })
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
    // tester func only
    getState(){
        // console.log('cell', this.state.startingCell)
        console.log('temp x', this.state.tempX)
        console.log('temp y', this.state.tempY)

        console.log('real x', this.state.position.x)
        console.log('real y', this.state.position.y)
    }
    directionToMove(x,y){
        let xDir
        let yDir
        // check if up or down / + -
        if(x < 0){
            xDir = "left"
        } else {
            xDir = "right"
        }
        if(y < 0){
            yDir = "top"
        } else {
            yDir = "bottom"
        }
        this.setState({
            xDir: xDir,
            yDir: yDir
        })
    }
    move(xVal,yVal){
        // console.log('x', this.state.position.x)
        // get corner box
        // var startStop = document.querySelector('.box-container:nth-of-type(39801)')

        let startStop = this.state.startingCell
        startStop.style["grid-column-start"] = xVal
        startStop.style["grid-column-end"] = xVal
        startStop.style["grid-row-start"] = this.adjustRowMovement(yVal)
        startStop.style["grid-row-end"] = this.adjustRowMovement(yVal)
        // add input to state val

        xVal = parseInt(this.state.position.x) + parseInt(xVal)
        yVal= parseInt(this.state.position.y) + parseInt(yVal)
            console.log('y', this.state.position.y)
            console.log('x', this.state.position.x)
            // set x, y, and starting
            this.setState({
                position: {
                    x: xVal,
                    y: yVal
                },
        })
    }
    // to start at bottom, and minus one
    adjustRowMovement(y){
        let total = 200
        let adjust = (total - y) + 1
        // console.log('a', adjust)
        return adjust
    }
    // hold vals in input until next entered
    updateXvalue(evt) {
        this.setState({
          tempX: evt.target.value
        })
        // console.log(`temp x: ${this.state.tempX}`)

    }
    updateYvalue(evt) {
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
    setStopsPosition(x, y){
        let that = this
        // get directions to mvmt - need to be set here for timing
        this.directionToMove(x, y)
        // timer to wait for window
        setTimeout(function(){
            let width = that.state.startingCell.offsetWidth
            let height = that.state.startingCell.offsetHeight
            function getCoords(){
                let xDir
                let yDir
                // check if up or down / + -
                if(x < 0){
                    xDir = "left"
                } else {
                    xDir = "right"
                }
                if(y < 0){
                    yDir = "top"
                } else {
                    yDir = "bottom"
                }
                console.log(width)
                console.log(height)
                let moveX = parseInt(x) * width
                let moveY = parseInt(y) * height
                console.log(moveX)
                console.log(moveY)
                // let that = this
                // console.log(this)

                setTimeout(function(){
                    that.setState({
                        stopCoords:{
                            xDir: moveX,
                            yDir: moveY
                        }
                    })

                },500)
            }
            getCoords()
        })

    }
    AddStopMarker(props){
        console.log('props', props)
        if(!props){
            return
        }
        let xx = props.move.xDir
        let yy = props.move.yDir
        let xCoord = props.move.stopCoords.xDir
        let yCoord = props.move.stopCoords.yDir
        let obj = {
            [xx]: xCoord,
            [yy]: yCoord
            // props.move.yDir: props.move
        }
        function markup(){
            if(props){
                console.log(obj)
                return(<div className="stop-marker" style={obj}></div>)
            } else {
                return null
            }
        }
        return(markup())
    }
    setStops(state){
        console.log('state', state)
        return state.stops.map(coords => {
            return(<this.AddStopMarker move={state} />)
        })
    }
    // move={this.state.mark(this.state.markerCoords.xDir, this.state.markerCoords.yDir)}/>
    render() {


        console.log(this.state)
        // {this.state.stopCoords ? <this.ShowMarker move={this.state}/> : null}
    	return(
            <div>
                <div className="grid-container">
                <div className="grid">

                <Box num={40000} />
                </div>

                </div>
                <form onSubmit={this.handleSubmit.bind(this)}>
                     X-coords: <input className="x-coord" type="text" value={this.state.tempX} onChange={evt => this.updateXvalue(evt)} >
                     </input>
                     Y-coords: <input className="y-coord" type="text" value={this.state.tempY} onChange={evt => this.updateYvalue(evt)}  ></input>
                     <input type="submit" value="Submit" onMouseOver={this.getState.bind(this)}></input>

                </form>
                <button onClick={() => {this.setStops(this.state)}}>Plot</button>
            </div>
        )
    }
}

// <div className="cursor">&#11044;</div>
export default Grid
