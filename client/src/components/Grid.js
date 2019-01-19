import React, {Component} from "react"
import "../App.css";
import Box from './Box'
import Stop from './Stop'

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
            stopToggle: false
		};

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

    // // takes state as an input
    // AddStopMarker(props){
    //     console.log('props', props)
    //     if(!props){
    //         return
    //     }
    //     let x = props.move.xDir
    //     let y = props.move.yDir
    //     let xCoord = props.move.stopCoords.xDir
    //     let yCoord = props.move.stopCoords.yDir
    //     let obj = {
    //         [x]: xCoord,
    //         [y]: yCoord
    //         // props.move.yDir: props.move
    //     }
    //     function markup(){
    //         if(props){
    //             console.log(obj)
    //             return(<div className="stop-marker" style={obj}></div>)
    //         } else {
    //             return null
    //         }
    //     }
    //     return(markup())
    // }
    // setStops(state){
    //     console.log('state', state)
    //     return state.stops.map(coords => {
    //         return(<this.AddStopMarker move={state} />)
    //     })
    // }
    // move={this.state.mark(this.state.markerCoords.xDir, this.state.markerCoords.yDir)}/>
    clickStops(){
        this.setState({
            stopToggle: !this.stopToggle
        })
    }
    render() {


        // {this.state.stopCoords ? <this.ShowMarker move={this.state}/> : null}
    	return(
            <div>
                <div className="grid-container">
                    <div className="grid">
                    <Stop coords={this.state.directionsArr}/>
                    <Box num={40000} />
                        {(this.state.stopToggle ? <Stop coords={this.state}/> : null)}
                    </div>

                </div>
                <form onSubmit={this.handleSubmit.bind(this)}>
                     X-coords: <input className="x-coord" type="text" value={this.state.tempX} onChange={evt => this.updateXvalue(evt)} >
                     </input>
                     Y-coords: <input className="y-coord" type="text" value={this.state.tempY} onChange={evt => this.updateYvalue(evt)}  ></input>
                     <input type="submit" value="Submit" onMouseOver={this.getState.bind(this)}></input>

                </form>
                <button onClick={this.clickStops.bind(this)}>Plot</button>
            </div>
        )
    }
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
    componentDidMount() {
        let that = this

        function setCellSizes(){
            setTimeout(function(){
                if(that.state.startingCell){
                    console.log(that.state)
                    // setTimeout(function(){
                        that.setState({
                            cellWidth: that.state.startingCell.offsetWidth,
                            cellHeight: that.state.startingCell.offsetHeight
                        })
                        return
                        // })
                    } else {
                        setCellSizes()
                    }
            },1000)
        }
        setCellSizes()
        // times x/y by height of each cell
        function getPixels(x,y,width, height){
            let moveX = parseInt(x) * width
            let moveY = parseInt(y) * height
            console.log(moveX)
            console.log(moveY)

            return {
                moveX: moveX,
                moveY: moveY
            }

            // setTimeout(function(){
            //     that.setState({
            //         stopCoords:{
            //             [this.state.xDir]: moveX,
            //             [this.state.yDir]: moveY
            //         }
            //     })
            //
            // },500)
        }
        // define direction if x/y is pos or neg
        function directionToMove(x,y){
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
            return {
                xDir: xDir,
                yDir: yDir
            }
            // this.setState({
            //     xDir: xDir,
            //     yDir: yDir
            // })
        }
        function setCoords(){
            let coordsArr = []
            // console.log(this)
            setTimeout(function(){
                if(that.state.stops.length > 0){
                    that.state.stops.forEach(obj => {
                        let directions = directionToMove(obj.x, obj.y)
                        let pixels = getPixels(obj.x, obj.y, that.state.cellWidth, that.state.cellHeight)
                        let coords = {
                            pixels: pixels,
                            directions: directions
                        }
                        coordsArr.push(coords)
                    })
                    console.log(coordsArr)
                    that.setState({
                        directionsArr: coordsArr
                    })

                }
            },1050)
        }
        setCoords()
        // set the cell size to know how to move
        // loop over stops
        // pass in x, y and get direction
        // pass in x,y and width and height - set css prop and pixesl to move
        // save to obj and push to Array - set to get
        // loop over array and feed into stops


        let startingCell = document.querySelector('.box-container:nth-of-type(39802)')

        this.setState({
            startingCell: startingCell,
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
        // console.log('temp x', this.state.tempX)
        // console.log('temp y', this.state.tempY)
        //
        // console.log('real x', this.state.position.x)
        // console.log('real y', this.state.position.y)
        console.log('arr', this.state.directionsArr)
    }
    // directionToMove(x,y){
    //     let xDir
    //     let yDir
    //     // check if up or down / + -
    //     if(x < 0){
    //         xDir = "left"
    //     } else {
    //         xDir = "right"
    //     }
    //     if(y < 0){
    //         yDir = "top"
    //     } else {
    //         yDir = "bottom"
    //     }
    //     this.setState({
    //         xDir: xDir,
    //         yDir: yDir
    //     })
    // }
}
// to start at bottom, and minus one

// <div className="cursor">&#11044;</div>
export default Grid
