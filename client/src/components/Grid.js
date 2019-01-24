import React, {Component} from "react"
import "../App.css";
import Box from './Box'
import Stop from './Stop'
import Truck from './Truck'
import Dropdown from './Dropdown'

class Grid extends Component {
	constructor(props) {
		super(props);
		this.state = {
            legs: [],
			stops: [],
            truckingStartCoords: {x: 19, y: 20},
            truckMoveCoords: '',
            startingCellNum: 39800,
            previousLegEndCell:0,
            previousStopX: 0,
            previousStopY: 0,
            previousLegX: 0,
            previousLegY:0,
            boxesToRender: Array.from({length: 40000}, (v, i) => i),
            holdAllStopColorIndexes: [],
            holdAllLegColorArrs: [],
            pushToColorGridArr:[],
            legCoords: [],
		};
        this.handleSelectSubmit = this.handleSelectSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);


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

    _numToMove(x,y, type){
        if(type === 'stop'){
            let moveX = Math.abs(this.state.previousStopX - x)
            let moveY = Math.abs(this.state.previousStopY - y)
            return {
                moveX: moveX,
                moveY: moveY
            }
        } else if(type === 'leg'){
            let moveX = Math.abs(this.state.previousLegX - x)
            let moveY = Math.abs(this.state.previousLegY - y)
            return {
                moveX: moveX,
                moveY: moveY
            }
        } else {
            console.error("error in the num to move function")
        }

    }
    colorGrid(x, y){
        let that = this
        console.log(this.state.previousStopX)
        console.log(this.state.previousStopY)
        // calc num of units to move based on prev position
        let tempCellNumsArr = []


        let tempX = x
        let tempY = y
        let tempCellNum = this.state.startingCellNum
        // convert based on next move using above function
        tempX = this._numToMove(tempX, tempY, 'stop').moveX
        tempY = this._numToMove(tempX, tempY, 'stop').moveY

        // on first move on grid only - for bottom corner
        if(this.state.previousStopX === 0 && this.state.previousStopY  === 0){
            tempX = tempX - 1
            tempY = tempY - 1
            tempCellNumsArr.push(tempCellNum)
        }
        // move in tandem while both vals exist
        while(tempX && tempY){
            // if last was les than current- do this
            if(this.state.previousStopY < y){
                tempCellNum = tempCellNum - 200
                tempCellNumsArr.push(tempCellNum)
            } else if(this.state.previousStopY > y){
                tempCellNum = tempCellNum + 200
                tempCellNumsArr.push(tempCellNum)
            }
            if(this.state.previousStopX < x){
                tempCellNum = tempCellNum + 1
                tempCellNumsArr.push(tempCellNum)

            } else if(this.state.previousStopX > x){
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
                if(this.state.previousStopY < y){
                    tempCellNum = tempCellNum - 200
                    tempCellNumsArr.push(tempCellNum)

                } else if(this.state.previousStopY > y){
                    tempCellNum = tempCellNum + 200
                    tempCellNumsArr.push(tempCellNum)
                }
            } else if(tempX){
                if(this.state.previousStopX < x){
                    tempCellNum = tempCellNum + 1
                    tempCellNumsArr.push(tempCellNum)
                } else if(this.state.previousStopX > x){
                    tempCellNum = tempCellNum - 1
                    tempCellNumsArr.push(tempCellNum)
                }
            }
        }
        // console.log(tempCellNumsArr)
        // holdAllStopColorIndexes - cells for color or entire plots - spread out
        // holdAllStopColorIndexes - each stops nums kept in its own arr
        this.setState({
            previousStopX: x,
            previousStopY: y,
            startingCellNum: tempCellNum,
            holdAllStopColorIndexes: [...this.state.holdAllStopColorIndexes, ...tempCellNumsArr],
            holdAllLegColorArrs: [...this.state.holdAllLegColorArrs, tempCellNumsArr]
        })
    }
    legStartEnd(x, y, startingCell){

        console.log('previous X',this.state.previousLegX)
        console.log('previous Y', this.state.previousLegY)
        // calc num of units to move based on prev position
        let tempCellNumsArr = []


        let tempX = x
        let tempY = y
        // start remains the same
        let tempStartNum
        // cell num changes with calcs
        let tempCellNum
        // on first move only
        if(this.state.previousLegEndCell === 0){
            tempStartNum = this.state.startingCellNum
            tempCellNum = this.state.startingCellNum
            // tempStartNum = this.state.startingCellNum
        } else {
            tempStartNum = this.state.previousLegEndCell
            tempCellNum = this.state.previousLegEndCell
        }
        console.log('start temp', tempCellNum)
        console.log('staring cell', tempStartNum)
        // convert based on next move using above function
        tempX = this._numToMove(tempX, tempY, 'leg').moveX
        tempY = this._numToMove(tempX, tempY, 'leg').moveY
        console.log('x to move',tempX)
        console.log('y to move', tempY)
        // on first move on grid only - for bottom corner
        if(this.state.previousLegX === 0 && this.state.previousLegY  === 0){
            tempX = tempX - 1
            tempY = tempY - 1
            // tempCellNumsArr.push(tempCellNum)
        }
        // move in tandem while both vals exist
        while(tempX && tempY){
            // if last was les than current- do this
            if(this.state.previousLegY < y){
                tempCellNum = tempCellNum - 200
                // tempCellNumsArr.push(tempCellNum)
            } else if(this.state.previousLegY > y){
                tempCellNum = tempCellNum + 200
                // tempCellNumsArr.push(tempCellNum)
            }
            if(this.state.previousLegX < x){
                tempCellNum = tempCellNum + 1
                // tempCellNumsArr.push(tempCellNum)

            } else if(this.state.previousLegX > x){
                tempCellNum = tempCellNum - 1
                // tempCellNumsArr.push(tempCellNum)
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
                if(this.state.previousLegY < y){
                    tempCellNum = tempCellNum - 200

                    // tempCellNumsArr.push(tempCellNum)

                } else if(this.state.previousLegY > y){
                    tempCellNum = tempCellNum + 200
                    // tempCellNumsArr.push(tempCellNum)
                }
            } else if(tempX){

                if(this.state.previousLegX < x){
                    tempCellNum = tempCellNum + 1
                    // tempCellNumsArr.push(tempCellNum)
                } else if(this.state.previousLegX > x){
                    tempCellNum = tempCellNum - 1
                    // tempCellNumsArr.push(tempCellNum)
                }
            }
        }
        console.log('last', tempCellNum)
        let legCellNums = {
            start: tempStartNum,
            end: tempCellNum
        }
        console.log('coords', legCellNums)
        // - make this previousLast
        this.setState({
            previousLegEndCell: tempCellNum,
            previousLegX: x,
            previousLegY: y,
            legCoords:[...this.state.legCoords,legCellNums]

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
                    // that.colorGrid(stop.x, stop.y)
            // console.log(index + 1)
            // console.log(stops.length)
            that.colorGrid(stop.x, stop.y)
                if((index + 1) === stops.length){
                console.log(that.state.holdAllLegColorArrs)
                    // console.log('push')
                     	that.setState({
                       	pushToColorGridArr:that.state.holdAllStopColorIndexes
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
                <Box toRender={this.state.boxesToRender} toAdd={(this.state.pushToColorGridArr.length ? this.state.pushToColorGridArr  : null)}/>

                </div>
                </div>
                <div className="utils-container">

                <form onSubmit={''}>
                X-coords: <input className="x-coord" type="text" value={this.state.tempX} onChange={evt => this.updateXvalue(evt)} >
                </input>
                Y-coords: <input className="y-coord" type="text" value={this.state.tempY} onChange={evt => this.updateYvalue(evt)}  ></input>
                <input type="submit" value="Submit" onMouseOver={''}></input>

                </form>
                <button onClick={this.colorAllStops.bind(this)}>ColorAllStops</button>
                <Dropdown legs={this.state.legs.length ? this.state.legs : null} onChange={this.handleChange} onSubmit={this.handleSelectSubmit}/>
                </div>

            </main>
        )
    }
    handleChange(value) {
        this.setState({value: value});
    }
    handleSelectSubmit(event) {
        event.preventDefault()
            console.log(this.colorLeg(this.state.value))

    }
    colorLeg(input){
        console.log(input)
        // - get val from Dropdown
        let index
        switch(input){
            case 'AB':
                index = 0
                break
            case 'BC':
                index = 1
                break
            case 'CD':
                index = 2
                break
            case 'DE':
                index = 3
                break
            case 'EF':
                index = 4
                break
            case 'FG':
                index = 5
                break
            case 'GH':
                index = 6
                break
            case 'HI':
                index = 7
                break
            case 'IJ':
                index = 8
                break
            case 'JK':
                index = 9
                break
            case 'KL':
                index = 10
                break
            default:
                console.error('Nothing in switch')
                break
        }
        return index
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
                // console.log(coords)
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
            console.log('res', res)
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
