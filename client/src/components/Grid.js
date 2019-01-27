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
            driverCoords: "",
            startingCellNumAll: 39800,
            startingCellNumPartial: "",
            previousLegEndCell:0,
            previousStopX: 0,
            previousStopY: 0,
            previousLegX: 0,
            previousLegY:0,
            partialLegStartCoords: "",
            partialLegEndCoords: "",
            boxesToRender: Array.from({length: 40000}, (v, i) => i),
            holdAllStopColorIndexes: [],
            holdAllLegColorArrs: [],
            finalStopColorArr:[],
            finalLegColorArr: [],
            finalDriverMoveObj: "",
            legStartEndCellNums: [],
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
            console.log('moveX',this.state.previousStopX )
            console.log('moveY', this.state.previousStopY)
            let moveX = Math.abs(this.state.previousStopX - x)
            console.log('abs x', moveX)
            let moveY = Math.abs(this.state.previousStopY - y)
            console.log('abs y', moveY)
            return {
                tempX: moveX,
                tempY: moveY
            }
        } else if(type === 'leg'){
            let moveX = Math.abs(this.state.previousLegX - x)
            let moveY = Math.abs(this.state.previousLegY - y)
            return {
                tempX: moveX,
                tempY: moveY
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
    // take amount in leg with a percent - returns num to move out total leg number
    _percentToCoords(diffObj, percent){
        let xNum = Math.floor((diffObj.xDiff * 0.01) * percent)
        let yNum = Math.floor((diffObj.yDiff * 0.01) * percent)
        let newX
        return {xNum, yNum}

    }
    // takes 3 objs - deterimine if driver moves coords up/down
    _getDriverDirection(firstLegStopObj, lastLegStopObj, numToMoveObj ){
        let x1 = firstLegStopObj.x
        let x2 = lastLegStopObj.x
        let y1 = firstLegStopObj.y
        let y2 = lastLegStopObj.y
        let xNum = numToMoveObj.xNum
        let yNum = numToMoveObj.yNum
        // if x moves up, add
        let xToMove
        let yToMove
        if(x1 < x2){
            // console.log(firstStopOfLeg[0].x)
            // console.log(lastStopOfLeg[0].x)
            xToMove = x1 + xNum
            // console.log(xToMove)
        } else if(x1 >= x2){
            xToMove = x1 - xNum
        } else {
            console.error("error in driver movement")
        }
        if(y1 < y2){
            yToMove = y1 + yNum
        } else if(y1 >= y2){
            yToMove = y1 - yNum
        } else {
            console.error("error in driver movement")
        }
        // console.log('x', xToMove)
        // console.log('y', yToMove)
        return {
            xToMove,
            yToMove
        }
    }
    setDriver(){
        // get from api
        let positionData = this.state.driver
        // get leg name
        let legName = positionData.activeLegID
        console.log('leg name', positionData)

        // correlate with stops- letters to match stops needed
        let firstLetter = legName[0]
        let secondLetter = legName[1]
        // get stop coords = filter ones that match
        let firstStopOfLeg = this.state.stops.filter(stop => {
            return stop.name === firstLetter
        })
        let lastStopOfLeg = this.state.stops.filter(stop => {
            return stop.name === secondLetter
        })
        // console.log('f', firstStopOfLeg)
        // console.log('s', lastStopOfLeg)
        //calc abs distance bwt coords  - coords for first and last
        let diffObj = this._absDiff(firstStopOfLeg[0], lastStopOfLeg[0])
        console.log(diffObj)

        let progress = parseInt(this.state.driver.legProgress)
        // takes number of moves and percent - returns number of moves that is
        let numToMove = this._percentToCoords(diffObj, progress)
        console.log('num to move',numToMove)
        // takes coords for first, last and how many -returns up / down & COORDS
        let { xToMove, yToMove } = this._getDriverDirection(firstStopOfLeg[0], lastStopOfLeg[0], numToMove)
        // convert the number to move to pixels
        let driverProgressinPixels = this._convertToPixels(xToMove, yToMove)

        let driverProgressObj = {
            pixels: driverProgressinPixels,
            directions: {
                xDir: "left",
                yDir: "bottom"
            }
        }
        // console.log(driverProgressObj)
        // coords
        let {x, y} = firstStopOfLeg[0]
        let driverLegStartcoords = {x,y}
        //
        // let index = this._legIndex(legName)
        // let leg = this.state.holdAllLegColorArrs[index]
        // console.log('leg', leg)

            //finalDriverMoveObj - cell nums of drivers leg
        this.setState({
            // x/y of driver
            driverCoords: {
                x: xToMove,
                y: yToMove
            },
            driverLegStart: driverLegStartcoords,
            finalDriverMoveObj: driverProgressObj
        })
        console.log(this.state.driverCoords)
    }

    // x=35
    // y=64
    colorCompleted(legID){
    	var arr = this.state.legs.filter(leg => {
    		return leg.legID === legID
    	})

        let holdingArrIndex = this._legIndex(arr[0].legID)
        let dataIndex = this.state.legs.indexOf(arr[0])
        console.log('holding' ,holdingArrIndex)
    	//all previous legs to color
        // var previousLegNames = this.state.legs.slice(0,index)
        // get arr of all previous arrs to color
        var previousLegArrs = this.state.holdAllLegColorArrs.slice(0, holdingArrIndex)
        var currentLegArr = this.state.holdAllLegColorArrs[holdingArrIndex]
        console.log('previouslegs', previousLegArrs)
        console.log('currnt arr', currentLegArr)
        // get start and end of current legs

        let thisLeg = this.state.legs[dataIndex]
        let nextLeg = this.state.legs[dataIndex + 1]
        // console.log(thisLeg)
        let legFirstStop = this.state.stops.filter(stop => {
            return stop.name === thisLeg.startStop
        })
        let legLastStop = this.state.stops.filter(stop => {
            return stop.name === thisLeg.endStop
        })
        // use coords to calc with percent
        let stopStartCoords = {
            x: legFirstStop[0].x,
            y: legFirstStop[0].y
        }
        let stopEndCoords = {
            x: legLastStop[0].x,
            y: legLastStop[0].y
        }
        let diffObj = this._absDiff(stopStartCoords, stopEndCoords)
        // console.log(diff)
        // percent driver is complete of leg
        let progress = parseInt(this.state.driver.legProgress)
        // takes number of moves and percent - returns number of moves that is partial of leg in coords
        let numToMove = this._percentToCoords(diffObj, progress)
        console.log('num to move', numToMove)
        console.log(this.state.legStartEndCellNums)
        // cell nums
        let { start, end } = this.state.legStartEndCellNums[holdingArrIndex]
        // set startingCell and start x / y
        this.setState({
            startingCellNumPartial: start,
            partialLegStartCoords: stopStartCoords,
            partialLegEndCoords: stopEndCoords,
            holdingCompletedArrs: [...previousLegArrs]
        })
        console.log(this.state.holdingCompletedArrs)
        console.log(start, end)
        // set state to start coords
        // inout end coords
        // this.state.driverCoords.x = 20
        // this.state.driverCoords.y = 13
        this.colorGrid(this.state.driverCoords.x,this.state.driverCoords.y, 'partialLeg')

        // get start cell num

        // let legStartEndCellNUm = this.state.legStartEndCellNums[index]
        // console.log(legStartEndCellNUm)

        // use calc to get num of cells in current arr/leg to color



        	//get cell of last leg in arr
    	// var chunk = this.state.holdAllLegColorArrs[index]
    	// var cell = chunk[chunk.length - 1]
        // console.log('all leg arrs',this.state.holdAllLegColorArrs)
        // console.log('single previous arr', chunk)
        // console.log('last cell or last arr', cell)
	    //   // need to call color grid with a type condional to get the part btw legs
    }
    colorGrid(x, y, type){

        let that = this
        // console.log(this.state.previousStopX)
        // console.log(this.state.previousStopY)
        // calc num of units to move based on prev position
        let tempCellNumsArr = []


        let tempX = x
        let tempY = y
        let tempCellNum
        if(type === 'all'){
            tempCellNum = this.state.startingCellNumAll
            // if(this.state.previousStopY !== 0 || this.state.previousStopX !== 0){
            //     this.setState({
            //         previousStopX: 0,
            //         previousStopY: 0
            //     })
            // }
            // console.log('previousx', this.state.previousStopX)
            // console.log('previousy', this.state.previousStopY)
            // console.log('currentx ', x)
            // console.log('currenty', y)
        } else if(type === 'partialLeg'){
            console.log('partial')
            // start of leg
            tempCellNum = this.state.startingCellNumPartial
            console.log('staring cell' ,this.state.startingCellNumPartial)
            // set to start coords - it should compute to end coord form here
            console.log('leg end x', this.state.partialLegEndCoords.x)
            console.log('leg end y', this.state.partialLegEndCoords.y)
            this.setState({
                previousStopX: this.state.partialLegStartCoords.x,
                previousStopY: this.state.partialLegStartCoords.y
            })
            console.log(this.state.previousStopX)
            console.log(this.state.previousStopY)
            console.log('previous',this.state.partialLegStartCoords)
            // console.log('previousx', this.state.previousStopX)
            // console.log('previousy', this.state.previousStopY)
            // console.log('currentx ', x)
            // console.log('currenty', y)

        }
        // console.log(tempX)
        // convert based on next move using above function
        tempX = this._numToMove(tempX, tempY, 'stop').tempX
        tempY = this._numToMove(tempX, tempY, 'stop').tempY
        // tempY = this._numToMove(tempX, tempY, 'stop').moveY
        console.log('tempx', tempX)
        console.log('tempy', tempY)

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
        // holdAllStopColorIndexes - cells for color or entire plots - spread out
        if(type === 'all'){
            // console.log(tempCellNumsArr)

            this.setState({
                previousStopX: x,
                previousStopY: y,
                startingCellNumAll: tempCellNum,
                holdAllStopColorIndexes: [...this.state.holdAllStopColorIndexes, ...tempCellNumsArr]
            })
            // will get call twice. Once for firs and last
        } else if(type === 'partialLeg'){
            console.log('cells arr',tempCellNumsArr)
            this.setState({
                previousStopX: x,
                previousStopY: y,
                startingCellNumPartial: tempCellNum,
                holdingCompletedArrs:[...this.state.holdingCompletedArrs, tempCellNumsArr]

            })
            console.log('complete', this.state.holdingCompletedArrs)
        }
    }
    legStartEnd(x,y){
        // console.log(x, y)
    // takes x y and determine start and end cells
        // legStartEnd(x, y){
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
            tempStartNum = this.state.startingCellNumAll
            tempCellNum = this.state.startingCellNumAll
            // tempStartNum = this.state.startingCellNumAll
        } else {
            tempStartNum = this.state.previousLegEndCell
            tempCellNum = this.state.previousLegEndCell
        }
        // console.log('start temp', tempCellNum)
        // console.log('staring cell', tempStartNum)
        // convert based on next move using above function
        tempX = this._numToMove(tempX, tempY, 'leg').tempX
        tempY = this._numToMove(tempX, tempY, 'leg').tempY
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
        // each array b4 being pushing into main one
        // console.log('tempCellNumsArr', tempCellNumsArr)
        // console.log('x', x)
        // console.log('y', y)
        // - make this previousLast
        this.setState({
            previousLegEndCell: tempCellNum,
            previousLegX: x,
            previousLegY: y,
            legStartEndCellNums:[...this.state.legStartEndCellNums,legCellNums],
            holdAllLegColorArrs: [...this.state.holdAllLegColorArrs, tempCellNumsArr]

        })
    }

    colorAllStops(){
        console.log('fired')
        // let arr = [1,2,3,4,5]
        let stops = [
            {x:20, y:10},
            {x: 20, y: 20}
            // {x: 25, y: 30},
            // {x: 25, y: 80}
        ]
        let that = this
        // stops.map((stop, index) => {
        //         setTimeout(function(){
        //             that.colorGrid(stop.x, stop.y)
            // console.log(index + 1)
            // console.log(stops.length)
                // if((index + 1) === that.state.stops.length){
                //     console.log('push')
                     	// that.setState({
                       // 	pushToChildArr:that.state.holdingAllIndexes
                       // })
                //  }
            //     },100*(index))
            // })
            console.log(this.state.finalStopColorArr)
            this.setState({
                finalStopColorArr: this.state.holdAllLegColorArrs
            })
            console.log(this.state.finalStopColorArr)
        // on click push to child state
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
                // set coords to change child state
                // that.setState({
                //     finalDriverMoveObj: coords
                // })

            }


        },1050)
    }
    componentDidMount() {
        let that = this

        setTimeout(function(){
            // console.log(that.state.legs)
            that.state.stops.map(stop => {
                    that.legStartEnd(stop.x, stop.y)
                // that.colorGrid(stop.x, stop.y, 'all')

            })
            that.setDriver()
            that.colorCompleted("CD")
            // that.colorCompleted(that.state.driverCoords.y)
            // console.log('state',that.state)
        },100)



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
