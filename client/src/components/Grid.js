import React, {Component} from "react"
import "../App.css";
import Box from './Box'
import Stop from './Stop'
import Truck from './Truck'

class Grid extends Component {
	constructor(props) {
		super(props);
		this.state = {
            legs: [],
			stops: [],
            truckingStartCoords: {x: 19, y: 20},
            truckMoveCoords: '',
            startingCellNum: 39800,
            previousX: 0,
            previousY: 0,
            boxesToRender: Array.from({length: 40000}, (v, i) => i),
            holdingAllIndexes: [],
            pushToChildArr:[]
		};
	}
    // takes and x/y and returns px to move
    convertToPixels(x,y){
        let totalX
        let totalY
        // first 10 cells = 100px
        // after that everythig 11px
        // - minus cells add 100px
        // - rest * 11 then sum
        if(x > 10){
            x = x - 10
            totalX = 100 + (x * 11)
        } else {
            totalX = x * 10
        }
        if(y > 10){
            y = y - 10
            totalY = 100 + (y * 11)
        } else {
            totalY = y * 10
        }
        let moveX = parseInt(totalX)
        let moveY = parseInt(totalY)
        // console.log('mx', moveX)
        // console.log('my', moveY)
        let coordsObj = {
            moveX: moveX,
            moveY: moveY
        }
        return coordsObj
    }
    colorGrid(x, y){
        let that = this
        console.log(this.state.previousX)
        console.log(this.state.previousY)
        // calc num of units to move based on prev position
        function _numToMove(){
            let moveX = Math.abs(that.state.previousX - x)
            let moveY = Math.abs(that.state.previousY - y)
            return {
                moveX: moveX,
                moveY: moveY
            }
        }
        let tempCellNumsArr = []


        let tempX = x
        let tempY = y
        let tempCellNum = this.state.startingCellNum
        // convert based on next move using above function
        tempX = _numToMove().moveX
        tempY = _numToMove().moveY

        // on first move on grid only - for bottom corner
        if(this.state.previousX === 0 && this.state.previousY  === 0){
            tempX = tempX - 1
            tempY = tempY - 1
            tempCellNumsArr.push(tempCellNum)
        }
        // move in tandem while both vals exist
        while(tempX && tempY){
            // if last was les than current- do this
            if(this.state.previousY < y){
                tempCellNum = tempCellNum - 200
                tempCellNumsArr.push(tempCellNum)
            } else if(this.state.previousY > y){
                tempCellNum = tempCellNum + 200
                tempCellNumsArr.push(tempCellNum)
            }
            if(this.state.previousX < x){
                tempCellNum = tempCellNum + 1
                tempCellNumsArr.push(tempCellNum)

            } else if(this.state.previousX > x){
                tempCellNum = tempCellNum - 1
                tempCellNumsArr.push(tempCellNum)
            }
            tempX = tempX - 1
            tempY = tempY - 1
        }
         // axis - loop over the only one left X or Y
        let loopAxis
        (tempY ? loopAxis = tempY : loopAxis = tempX)
        // if only on val left, move on its own
        for (var i = 0; i < loopAxis; i++) {
            if(tempY){
                if(this.state.previousY < y){
                    tempCellNum = tempCellNum - 200
                    tempCellNumsArr.push(tempCellNum)

                } else if(this.state.previousY > y){
                    tempCellNum = tempCellNum + 200
                    tempCellNumsArr.push(tempCellNum)
                }
            } else if(tempX){
                if(this.state.previousX < x){
                    tempCellNum = tempCellNum + 1
                    tempCellNumsArr.push(tempCellNum)
                } else if(this.state.previousX > x){
                    tempCellNum = tempCellNum - 1
                    tempCellNumsArr.push(tempCellNum)
                }
            }
        }
        this.setState({
            previousX: x,
            previousY: y,
            startingCellNum: tempCellNum,
            holdingAllIndexes: [...this.state.holdingAllIndexes, ...tempCellNumsArr]
        })
    }

    colorAllStops(){
        let arr = [1,2,3,4,5]
        let stops = [
            {x:20, y:10},
            {x: 20, y: 20}
            // {x: 25, y: 30},
            // {x: 25, y: 80}
        ]

        stops.map((stop, index) => {
                let that = this
                setTimeout(function(){
                    that.colorGrid(stop.x, stop.y)
            // console.log(index + 1)
            // console.log(stops.length)

                if((index + 1) === stops.length){
                    console.log('push')
                     	that.setState({
                       	pushToChildArr:that.state.holdingAllIndexes
                       })
                 }
                },100*(index))
            })
    }
    render() {
    	return(
            <main className="page-container">
                <div className="grid-container">

                <div className="grid">

                <Truck coords={this.state.truckMoveCoords}/>
                <Stop coords={this.state.stopsDirsArr}/>
                <Box toRender={this.state.boxesToRender} toAdd={(this.state.pushToChildArr.length ? this.state.pushToChildArr  : null)}/>

                </div>
                </div>
                <div className="utils-container">

                <form onSubmit={this.handleSubmit.bind(this)}>
                X-coords: <input className="x-coord" type="text" value={this.state.tempX} onChange={evt => this.updateXvalue(evt)} >
                </input>
                Y-coords: <input className="y-coord" type="text" value={this.state.tempY} onChange={evt => this.updateYvalue(evt)}  ></input>
                <input type="submit" value="Submit" onMouseOver={''}></input>

                </form>
                <button onClick={this.colorAllStops.bind(this)}>ColorAllStops</button>
                </div>

            </main>
        )
    }

    handleSubmit(event) {
        // console.log(`temp x: ${this.state.tempX}`)
        // console.log(`temp y: ${this.state.tempY}`)
        this.move(this.state.tempX, this.state.tempY)
        // alert('A name was submitted: ' + this.state.value);
        event.preventDefault();
    }
    // set coords in pxs of plots
    setStopCoords(type){
        let that = this
        let coordsArr = []

        setTimeout(function(){
            // filter out undefined
            if(type === 'stop'){
                if(that.state.stops.length > 0){
                    that.state.stops.forEach(stop => {
                        // console.log(stop.x, stop.y)
                        let pixels = that.convertToPixels(
                            stop.x, stop.y
                        )
                        let coords = {
                            pixels: pixels,
                            directions: {
                                xDir: "left",
                                yDir: "bottom"
                            }
                        }

                        coordsArr.push(coords)
                    })
                }
                that.setState({
                    stopsDirsArr: coordsArr
                })
            } else if(type === 'truck'){
                let pixels = that.convertToPixels(that.state.truckingStartCoords.x, that.state.truckingStartCoords.y)
                let coords = {
                    pixels: pixels,
                    directions: {
                        xDir: "left",
                        yDir: "bottom"
                    }
                }
                console.log(coords)
                that.setState({
                    truckMoveCoords: coords
                })

            }


        },1050)
    }
    componentDidMount() {

        let that = this

        this.setStopCoords('stop')
        this.setStopCoords('truck')
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
}

export default Grid
