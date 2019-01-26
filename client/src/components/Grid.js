import React, { Component } from "react";
import { Manager, Reference, Popper, Arrow } from "react-popper";

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
            driver: "",
            driverLegStart: "",
            driverMoveCoords: '',
            startingCellNum: 39800,
            previousLegEndCell:0,
            previousStopX: 0,
            previousStopY: 0,
            previousLegX: 0,
            previousLegY:0,
            boxesToRender: Array.from({length: 40000}, (v, i) => i),
            holdAllStopColorIndexes: [],
            holdAllLegColorArrs: [],
            finalStopColorArr:[],
            finalLegColorArr: [],
            finalDriverMoveObj: "",
            legStartEndCoords: [],
		};
        this.handleSelectSubmit = this.handleSelectSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);


	}
    // takes and x/y and returns px to move
    _convertToPixels(x,y){
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
    // takes coords and type - needs access to state
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
    // takes 2 objs of coords and determines the diff
    _absDiff(firstCoordsObj, secondCoordsObj){
        let xDiff = Math.abs(firstCoordsObj.x - secondCoordsObj.x)
        let yDiff = Math.abs(firstCoordsObj.y - secondCoordsObj.y)
        return {
            xDiff,
            yDiff
        }
    }
    // take amount in leg with a percent - returns num to move
    _percentToCoords(diffObj, percent){
        let xNum = Math.floor((diffObj.xDiff * 0.01) * percent)
        let yNum = Math.floor((diffObj.yDiff * 0.01) * percent)
        return {xNum, yNum}

    }
    setDriver(){
        // get from api
        let positionData = this.state.driver
        // leg name
        let legName = positionData.activeLegID
        console.log('leg name', positionData)

        // let legIndex = this._legIndex(legName)


        // letter to match stop
        let firstLetter = legName[0]
        let secondLetter = legName[1]
        // get stop coords - x, y
        let firstStopOfLeg = this.state.stops.filter(stop => {
            return stop.name === firstLetter
        })
        let lastStopOfLeg = this.state.stops.filter(stop => {
            return stop.name === secondLetter
        })
        console.log('f', firstStopOfLeg)
        // console.log('s', lastStopOfLeg)
        let diffObj = this._absDiff(firstStopOfLeg[0], lastStopOfLeg[0])

        let progress = parseInt(this.state.driver.legProgress)

        let numToMove = this._percentToCoords(diffObj, progress)
        console.log(numToMove)

        function getTruckDirection(){
            // if x moves up, add
            let xToMove
            let yToMove
            if(firstStopOfLeg[0].x >= lastStopOfLeg[0].x){
                // console.log(firstStopOfLeg[0].x)
                // console.log(lastStopOfLeg[0].x)

                xToMove = firstStopOfLeg[0].x + numToMove.xNum
                // console.log(xToMove)
            } else if(firstStopOfLeg[0].x < lastStopOfLeg[0].x){
                xToMove = firstStopOfLeg[0].x - numToMove.xNum
            }
            if(firstStopOfLeg[0].y >= lastStopOfLeg[0].y){
                yToMove = firstStopOfLeg[0].y + numToMove.yNum
            } else if(firstStopOfLeg[0].y < lastStopOfLeg[0].y){
                yToMove = firstStopOfLeg[0].y - numToMove.yNum
            }
            // console.log('x', xToMove)
            // console.log('y', yToMove)
            return {
                xToMove,
                yToMove
            }
        }
        console.log(getTruckDirection())

        let { xToMove, yToMove } = getTruckDirection()
        let driverProgressCoords = this._convertToPixels(xToMove, yToMove)

        let driverProgressObj = {
            pixels: driverProgressCoords,
            directions: {
                xDir: "left",
                yDir: "bottom"
            }
        }
        console.log(driverProgressObj)
        // coords
        let {x, y} = firstStopOfLeg[0]
        let driverLegStartcoords = {x,y}

        let index = this._legIndex(legName)
        let leg = this.state.holdAllLegColorArrs[index]
            // console.log('leg', leg)

            //finalDriverMoveObj - cell nums of drivers leg
        this.setState({
            driverLegStart: driverLegStartcoords,
            finalDriverMoveObj: driverProgressObj
        })

    }
    colorGrid(x, y){
        let that = this
        // console.log(this.state.previousStopX)
        // console.log(this.state.previousStopY)
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

        this.setState({
            previousStopX: x,
            previousStopY: y,
            startingCellNum: tempCellNum,
            holdAllStopColorIndexes: [...this.state.holdAllStopColorIndexes, ...tempCellNumsArr]
        })
    }
    // takes x y and determine start and end cells
    legStartEnd(x, y){
        // console.log('previous X',this.state.previousLegX)
        // console.log('previous Y', this.state.previousLegY)
        // push all cellnums to arr like colors
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
        // console.log('start temp', tempCellNum)
        // console.log('staring cell', tempStartNum)
        // convert based on next move using above function
        tempX = this._numToMove(tempX, tempY, 'leg').moveX
        tempY = this._numToMove(tempX, tempY, 'leg').moveY
        // console.log('x to move',tempX)
        // console.log('y to move', tempY)
        // on first move on grid only - for bottom corner
        if(this.state.previousLegX === 0 && this.state.previousLegY  === 0){
            tempX = tempX - 1
            tempY = tempY - 1
            tempCellNumsArr.push(tempCellNum)
        }
        // move in tandem while both vals exist
        while(tempX && tempY){
            // if last was les than current- do this
            if(this.state.previousLegY < y){
                tempCellNum = tempCellNum - 200
                tempCellNumsArr.push(tempCellNum)
            } else if(this.state.previousLegY > y){
                tempCellNum = tempCellNum + 200
                tempCellNumsArr.push(tempCellNum)
            }
            if(this.state.previousLegX < x){
                tempCellNum = tempCellNum + 1
                tempCellNumsArr.push(tempCellNum)

            } else if(this.state.previousLegX > x){
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
                if(this.state.previousLegY < y){
                    tempCellNum = tempCellNum - 200

                    tempCellNumsArr.push(tempCellNum)

                } else if(this.state.previousLegY > y){
                    tempCellNum = tempCellNum + 200
                    tempCellNumsArr.push(tempCellNum)
                }
            } else if(tempX){

                if(this.state.previousLegX < x){
                    tempCellNum = tempCellNum + 1
                    tempCellNumsArr.push(tempCellNum)
                } else if(this.state.previousLegX > x){
                    tempCellNum = tempCellNum - 1
                    tempCellNumsArr.push(tempCellNum)
                }
            }
        }
        // console.log('last', tempCellNum)
        let legCellNums = {
            start: tempStartNum,
            end: tempCellNum
        }
        // console.log('coords', legCellNums)
        // console.log('x', x)
        // console.log('y', y)
        // - make this previousLast
        this.setState({
            previousLegEndCell: tempCellNum,
            previousLegX: x,
            previousLegY: y,
            legStartEndCoords:[...this.state.legStartEndCoords,legCellNums],
            holdAllLegColorArrs: [...this.state.holdAllLegColorArrs, tempCellNumsArr]

        })
    }

    colorAllStops(){
        // let arr = [1,2,3,4,5]
        // let stops = [
        //     {x:20, y:10},
        //     {x: 20, y: 20}
        //     // {x: 25, y: 30},
        //     // {x: 25, y: 80}
        // ]
        // on click push to child state
        this.setState({
            finalStopColorArr: this.state.holdAllStopColorIndexes
        })
    }
    render() {
    	return(
            <main className="page-container">
                <div className="grid-container">

                <div className="grid">

                <Truck coords={this.state.finalDriverMoveObj ? this.state.finalDriverMoveObj : null}/>
                <Stop coords={this.state.stopsDirsArr}/>
                <Box
                    toRender={this.state.boxesToRender} stopsColor={(this.state.finalStopColorArr.length ? this.state.finalStopColorArr  : null)}
                    legsColor={(this.state.finalLegColorArr.length ? this.state.finalLegColorArr : null)}
                />

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
        this.colorLeg(this.state.value)

    }
    _legIndex(input){
        let index
        switch(input){
            // pre-stop
            case 'ZZ':
                index = 0
                break
            case 'AB':
                index = 1
                break
            case 'BC':
                index = 2
                break
            case 'CD':
                index = 3
                break
            case 'DE':
                index = 4
                break
            case 'EF':
                index = 5
                break
            case 'FG':
                index = 6
                break
            case 'GH':
                index = 7
                break
            case 'HI':
                index = 8
                break
            case 'IJ':
                index = 9
                break
            case 'JK':
                index = 10
                break
            case 'KL':
                index = 11
                break
            default:
                console.error('Nothing in switch')
                break
        }
        return index
    }
    colorLeg(input){
        let that = this
        // - get val from Dropdown-
        // change it to an index

        let index = this._legIndex(input)
        // get leg using index out of array
        let leg = this.state.holdAllLegColorArrs[index]
        // set state on child to change the color
        this.setState({
            finalLegColorArr: leg
        })
    }

    // set coords in pxs of plots
    _setStopCoords(type){
        let that = this
        let coordsArr = []

        setTimeout(function(){
            // filter out undefined
            if(type === 'stop'){
                if(that.state.stops.length > 0){
                    that.state.stops.forEach(stop => {
                        // console.log(stop.x, stop.y)
                        let pixels = that._convertToPixels(
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

                // let pixels = that._convertToPixels(that.state.driverLegStart.x, that.state.driverLegStart.y)
                // let coords = {
                //     pixels: pixels,
                //     directions: {
                //         xDir: "left",
                //         yDir: "bottom"
                //     }
                // }
                // console.log(coords)
                // // set coords to change child state
                // that.setState({
                //     finalDriverMoveObj: coords
                // })

            }


        },1050)
    }
    componentDidMount() {
        let that = this

        setTimeout(function(){
            that.state.stops.map(stop => {
                that.legStartEnd(stop.x, stop.y)
                that.colorGrid(stop.x, stop.y)

            })
            that.setDriver()
            console.log('state',that.state)
        },100)
        setTimeout(function(){
                console.log(that.state)
        },2000)


        // call to set stops and truck
        this._setStopCoords('stop')
        this._setStopCoords('truck')
        // Call our fetch function below once the component mounts
        this._callDriver()
        .then(res => {
            this.setState({ driver: res.driver })
        })
        .catch(err => console.log(err));
        this._callStops()
        .then(res => {
            this.setState({ stops: res.stops })
        })
        .catch(err => console.log(err));
        this._callLegs()
        .then(res => {
            this.setState({ legs: res.legs })
        })
        .catch(err => console.log(err));

    }
    _callLegs = async () => {
        const response = await fetch('/legs');
        const body = await response.json();

        if (response.status !== 200) {
            throw Error(body.message)
        }
        return body
    }
    _callStops = async () => {
        const response = await fetch('/stops');
        const body = await response.json();

        if (response.status !== 200) {
            throw Error(body.message)
        }
        return body
    }
    _callDriver = async () => {
        const response = await fetch('/driver');
        const body = await response.json();

        if (response.status !== 200) {

            throw Error(body.message)
        }
        return body
    }
}

export default Grid
