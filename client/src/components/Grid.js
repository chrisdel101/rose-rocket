import React, { Component } from "react";
import { Manager, Reference, Popper, Arrow } from "react-popper";

import "../App.css";
import Box from './Box'
import Stop from './Stop'
import Truck from './Truck'
import Dropdown from './Dropdown'
import Form from './Form'
import Switch from './Switch'
import Tabs from './Tabs'
import Accordion from './Accordion'
import AddButton from './AddButton'

class Grid extends Component {
	constructor(props) {
		super(props);
		this.state = {
            isActive:{
                button1: true,
                button2: false
            },
            expandedPanelName: "",
            uniqueId:0,
            legs: [],
			stops: [],
            legToColorID:"",
            trucks: [],
            driverFormX:"",
            driverFormY:"",
            driverLegInput:"",
            driverProgressInput: "",
            currentDriver: "",
            driverLegStart: "",
            driverCoords: "",
            positionSelect: "coords",
            startingCellNumAll: 39800,
            startingCellNumPartial: "",
            previousLegEndCell:0,
            previousStopX: 0,
            previousStopY: 0,
            previousLegX: 0,
            previousLegY:0,
            partialLegStartCoords: "",
            partialLegEndCoords: "",
            boxesToRender: Array.from({length: 100}, (v, i) => i),
            holdAllStopColorIndexes: [],
            holdAllLegColorArrs: [],
            holdingCompletedArrs: [],
            finalStopColorArr:[],
            finalLegColorArr: [],
            finalCompletedColorsArr: [],
            finalDriverMoveObj: "",
            finalDriverMoveArr: [],
            legStartEndCellNums: [],
            utils: {
                driverText: "Select leg for driver",
                colorText: "Select a Leg to color"
            }
		};
        this.handleDropdownSubmit = this.handleDropdownSubmit.bind(this);
        this.handleDropdownChange = this.handleDropdownChange.bind(this);


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
            // console.log('moveX',this.state.previousStopX )
            // console.log('moveY', this.state.previousStopY)
            let moveX = Math.abs(this.state.previousStopX - x)
            // console.log('abs x', moveX)
            let moveY = Math.abs(this.state.previousStopY - y)
            // console.log('abs y', moveY)
            return {
                tempX: moveX,
                tempY: moveY
            }
        } else if(type === 'leg'){
            // console.log('prevX', this.state.previousLegX)
            // console.log('prevY', this.state.previousLegY)
            let moveX = Math.abs(this.state.previousLegX - x)
            // console.log('in move previous', moveX)
            let moveY = Math.abs(this.state.previousLegY - y)
            // console.log('in move previous', moveY)
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
    // take amount in leg with a percent - returns num to move out of total leg number
    _percentToCoords(diffObj, percent){
        let xNum = Math.floor((diffObj.xDiff * 0.01) * percent)
        let yNum = Math.floor((diffObj.yDiff * 0.01) * percent)
        let newX
        return {xNum, yNum}

    }
    _driverCurrentCoords(numToMove, direction){
        if(direction === 'up'){
            console.log('driver C', this.state.driverCoords)
        } else if(direction === 'down'){

        } else {
            console.error("Error in get driver coords")
            return
        }
    }
    // takes 3 objs - deterimine if driver moves coords up/down
    _getDriverCoords(firstLegStopObj, lastLegStopObj, numToMoveObj ){
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
    //get driver pos based on the legData and progress - add to array - send to child
    addDriver(driverData){
        // get from api
        let legName = driverData.activeLegID
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
        //calc abs distance bwt coords  - coords for first and last
        let diffObj = this._absDiff(firstStopOfLeg[0], lastStopOfLeg[0])
        // console.log(diffObj)

        let progress = parseInt(driverData.legProgress)
        // takes number of moves and percent - returns number of moves that is
        let numToMove = this._percentToCoords(diffObj, progress)
        // takes coords for first, last and how many -returns up / down & COORDS
        let { xToMove, yToMove } = this._getDriverCoords(firstStopOfLeg[0], lastStopOfLeg[0], numToMove)
        // console.log(xToMove, yToMove)
        // convert the number to move to pixels
        let driverProgressinPixels = this._convertToPixels(xToMove, yToMove)

        let driverProgressObj = {
            pixels: driverProgressinPixels,
            directions: {
                xDir: "left",
                yDir: "bottom"
            },
            data: driverData
        }
            //finalDriverMoveObj - cell nums of drivers leg
        this.setState({
            // x/y of driver
            driverCoords: {
                x: xToMove,
                y: yToMove
            },
            finalDriverMoveArr: [...this.state.finalDriverMoveArr, driverProgressObj]
        })
    }
    // calc up to driver position to color
    colorCompleted(legID){
    	var arr = this.state.legs.filter(leg => {
    		return leg.legID === legID
    	})
        //index for arr of cell nums
        let holdingArrIndex = this._legIndex(arr[0].legID)
        // console.log(holdingArrIndex)
        // index for json with legs info
        let dataIndex = this.state.legs.indexOf(arr[0])
        // console.log('holding' ,holdingArrIndex)
    	//all previous legs to color
        // var previousLegNames = this.state.legs.slice(0,index)

        // get arr of all previous arrs to cell nums
        var previousLegArrs = this.state.holdAllLegColorArrs.slice(0, holdingArrIndex)
        //get current arr leg of cell nums
        var currentLegArr = this.state.holdAllLegColorArrs[holdingArrIndex]
        console.log('previouslegs', previousLegArrs)
        // console.log('currnt arr', currentLegArr)
        // get current and next leg json info
        let thisLeg = this.state.legs[dataIndex]
        let nextLeg = this.state.legs[dataIndex + 1]

        let legFirstStop = this.state.stops.filter(stop => {
            return stop.name === thisLeg.startStop
        })
        let legLastStop = this.state.stops.filter(stop => {
            return stop.name === thisLeg.endStop
        })
        // get first and end coords
        let stopStartCoords = {
            x: legFirstStop[0].x,
            y: legFirstStop[0].y
        }
        let stopEndCoords = {
            x: legLastStop[0].x,
            y: legLastStop[0].y
        }
        // console.log(stopEndCoords)
        // get diff to get number of moves
        // let diffObj = this._absDiff(stopStartCoords, stopEndCoords)
        // console.log(diff)
        // percent driver is complete of leg
        // let progress = parseInt(this.state.driver.legProgress)
        // // takes number of moves and percent - returns number of moves that is partial of leg in coords
        // let numToMove = this._percentToCoords(diffObj, progress)
        // console.log('num to move', numToMove)
        // console.log(this.state.legStartEndCellNums)
        // cell nums
        let { start, end } = this.state.legStartEndCellNums[holdingArrIndex]
        // console.log('start/end', start, end)
        // set startingCell and start x / y

        // this.state.startingCellNumPartial: start/end cells
        // 24034 34034
        // this.partialLegStartCoords: start x/y
        // {x: 35, y: 80}
        // this.state.partialLegEndCoords: end
        // {x: 35, y: 30}
        var previousLegArrs = this.state.holdAllLegColorArrs.slice(0, holdingArrIndex)

        this.setState({
            startingCellNumPartial: start,
            partialLegStartCoords: stopStartCoords,
            partialLegEndCoords: stopEndCoords,
            holdingCompletedArrs: [...previousLegArrs]
        })
        // console.log('startingCell', start)
        // console.log('stop/start', stopStartCoords)
        // console.log('partial leg end', stopEndCoords)
        // console.log('all', [...previousLegArrs])


        // console.log(this.state.holdingCompletedArrs)
        // console.log(start, end)
        // set state to start coords
        // inout end coords
        // this.state.driverCoords.x = 20
        // this.state.driverCoords.y = 13
        // console.log(this.state.driverCoords)
        this.legStartEnd(this.state.driverCoords.x,this.state.driverCoords.y, 'partial')

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
        }

        // console.log(tempX)
        // convert based on next move using above function
        tempX = this._numToMove(tempX, tempY, 'stop').tempX
        tempY = this._numToMove(tempX, tempY, 'stop').tempY
        // tempY = this._numToMove(tempX, tempY, 'stop').moveY
        // console.log('tempx', tempX)
        // console.log('tempy', tempY)

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
        }

    }
    // takes x y and determine start and end cells
    legStartEnd(x,y, type){

        let tempCellNumsArr = []

        let tempX = x
        let tempY = y
        // start remains the same
        let tempStartNum
        // cell num changes with calcs
        let tempCellNum


        if(type === 'all'){
            // on first move only
            if(this.state.previousLegEndCell === 0){
                tempStartNum = this.state.startingCellNumAll
                tempCellNum = this.state.startingCellNumAll
                // tempStartNum = this.state.startingCellNumAll
            } else {
                tempStartNum = this.state.previousLegEndCell
                tempCellNum = this.state.previousLegEndCell
            }
        } else if(type === 'partial'){
            // previous X and Y wrong in here

            // console.log('previousX', this.state.previousLegEndCell)
            // console.log('previousY', this.state.previousLegEndCell)
            // start of leg
            tempCellNum = this.state.startingCellNumPartial
            // console.log('staring cell' ,this.state.startingCellNumPartial)
            // set to start coords - it should compute to end coord form here
            // console.log('leg start x', this.state.partialLegStartCoords.x)
            // console.log('leg startStop y', this.state.partialLegStartCoords.y)
            // console.log('prevX',this.state.previousLegX)
            // console.log('prevXY',this.state.previousLegY)
            // need to reset previous x and y
            this.setState({
                previousLegX: this.state.partialLegStartCoords.x,
                previousLegY: this.state.partialLegStartCoords.y
            })
            // console.log('prevX',this.state.previousLegX)
            // console.log('prevXY',this.state.previousLegY)
            // console.log('to x', x)
            // console.log('to y', y)
            // console.log(this.state.previousStopX)
            // console.log(this.state.previousStopY)
            // console.log('previous',this.state.partialLegStartCoords)
            // console.log('previousx', this.state.previousStopX)
            // console.log('previousy', this.state.previousStopY)
            // console.log('currentx ', x)
            // console.log('currenty', y)



        }

        // console.log('start temp', tempCellNum)
        // console.log('staring cell', tempStartNum)
        // convert based on next move using above function
        ({ tempX, tempY } = this._numToMove(tempX, tempY, 'leg'))
        // tempY = this._numToMove(tempX, tempY, 'leg').tempY
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
        if(type === 'all'){
            this.setState({
                previousLegEndCell: tempCellNum,
                previousLegX: x,
                previousLegY: y,
                legStartEndCellNums:[...this.state.legStartEndCellNums,legCellNums],
                holdAllLegColorArrs: [...this.state.holdAllLegColorArrs, tempCellNumsArr]

            })
            // console.log('all', this.state.holdAllLegColorArrs)
            // console.log('end of run x', this.state.previousLegX)
            // console.log('end of run y', this.state.previousLegY)
        } else if(type === 'partial'){
            // console.log('cells arr',tempCellNumsArr)
            this.setState({
                previousStopX: x,
                previousStopY: y,
                startingCellNumPartial: tempCellNum,
                holdingCompletedArrs:[...this.state.holdingCompletedArrs, tempCellNumsArr]

            })
            // console.log('complete', this.state.holdingCompletedArrs)

        }
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

            this.setState({
                finalStopColorArr: this.state.holdAllStopColorIndexes
            })
            // console.log(this.state.finalStopColorArr)
        // on click push to child state
    }
    // on click pass props to chilc
    colorCompletedStops(){
            console.log(this.state.holdingCompletedArrs)
            let merged = [].concat.apply([], this.state.holdingCompletedArrs);
            console.log(merged)
            this.setState({
                finalCompletedColorsArr: merged
            })
    }
    // on click set driver with coords and send to child
    setDriverWithCoords(){
        // reset to zero
        this._resetTruck()
        // get pixels to new location
        let coords = this._setStopCoords('driver',
        this.state.driverFormX, this.state.driverFormY)

        this.setState({
            finalDriverMoveObj: coords
        })
    }
    // takes driver coords and finds the leg start
    _getLegStartfromCoords(){
        let coords = this.state.driverCoords
        console.log('driver coords', coords)
        // if x & y is between the stops
        let firstStop = this.state.stops.filter((coord, index) => {
            let stop1 = this.state.stops[index  ]
            let stop2 = this.state.stops[index + 1]
            console.log('stop1', stop1)
            console.log('stop2', stop2)
            console.log('x',coords.x)
            console.log('y', coords.y)
        	if(stop2 === undefined) return
        	if( //x/y are both btw
                (
                    ((coords.y > stop1.y && coords.y < stop2.y) ||
                    (coords.y < stop1.y && coords.y > stop2.y)) &&
                    ((coords.x > stop1.x && coords.x < stop2.x) ||
                    (coords.x < stop1.x && coords.x > stop2.x))
                )
            ){
                console.log('both are btw')
                    return coord
            } else if(
                // y is bwn and x is equal
                (
                    ((coords.y > stop1.y && coords.y < stop2.y) ||
                    (coords.y < stop1.y && coords.y > stop2.y))
                    &&
                    (coords.x === stop1.x && coords.x === stop2.x)
                )
            ){
                console.log('y btw. x equal' )
                    return coord
            } else if(
                // x is bwn and y is equal
                (
                    ((coords.x > stop1.x && coords.x < stop2.x) ||
                    (coords.x < stop1.x && coords.x > stop2.x))
                    &&
                    (coords.y === stop1.y && coords.y === stop2.y)
                )
            ){
                console.log('x btw. y equal' )

                return coord
            } else if(
                //coords are exact match
                (
                    coords.x === stop1.x && coords.y === stop1.y
                )

            ){
                console.log('both equal')
                return coord
            } else {
                // not within the stops
                return null
            }
        })
            console.log('return firstStop', firstStop)
        return firstStop
    }
    // takes first stop obj, driver coords obj, and abs diff of a single stops axis
    _findPercentFromDriverCoords(firstStop, driverCoords, yAbsDiff, xAbsDiff){
        let x1 = parseInt(firstStop.x)
        let y1 = parseInt(firstStop.y)
        let x2 = parseInt(driverCoords.x)
        let y2 = parseInt(driverCoords.y)
        console.log(driverCoords)
        console.log('1', x1)
        console.log('2', y1)
        console.log('3', x2)
        console.log('4', y2)
        let xDiff
        let yDiff
        console.log('xAbsDiff', xAbsDiff)
        console.log('yAbsDiff', yAbsDiff)
        // find number moved from last stop
        if(x1 < x2){
            console.log('run 1')
            // console.log(firstStopOfLeg[0].x)
            // console.log(lastStopOfLeg[0].x)
            xDiff = x2 - x1
            // console.log(xToMove)
        } else if(x1 > x2){
            console.log('run 2')
            xDiff = x1 - x2
        }  else if(x1 === x2){
            xDiff = 0
        } else {
            console.error("error in driver movement")
        }
        if(y1 < y2){
            // console.log('run 1')
            yDiff = y2 - y1
        } else if(y1 > y2){
            // console.log('run 2')
            yDiff = y1 - y2
        } else if(y1 === y2){
            yDiff = 0
        } else {
            console.error("error in driver movement")
        }
        console.log('xDiff', xDiff)
        console.log('yDiff', yDiff)
        // divide number moved so far in leg by total number in leg
        let xPercent
        let yPercent
        // check for zero vals
        if(xDiff === 0){
            xPercent = 0
        }
        if(yDiff === 0){
            yPercent = 0
        }
        if(xDiff && xDiff !== 0){
            console.log('xdiff', xDiff)
            xPercent = xDiff / xAbsDiff
        }
        if(yDiff && yDiff !== 0){
            console.log('yDiff',yDiff)
            yPercent = yDiff / yAbsDiff
        }
        let finalPercent
        console.log(xPercent)
        console.log(yPercent)
        // if one val is missing use the other alone
        if(!xPercent || !yPercent){
            if(xPercent){
                return finalPercent = xPercent * 100
            } else if(yPercent){
                return finalPercent = yPercent * 100
            }
        }
        // it both are zero then zero percent
        if(xPercent === 0 && yPercent === 0){
            return finalPercent = 0
        }

        console.log('x%',xPercent)
        console.log('y%',yPercent)
        //use the larger leg to updaet val - TODO: make both percents equal so driver fits back into grid
        if(xAbsDiff > yAbsDiff){
            return finalPercent = xPercent
        } else if(xAbsDiff < yAbsDiff){
            return finalPercent = yPercent
            // if equal use the larger percent
        } else if(xAbsDiff === yAbsDiff){
            if(xPercent >= yPercent){
                return finalPercent = xPercent
            } else {
                return finalPercent = yPercent
            }
        } else {
            console.error('An error occured in the percentage calcs')
            return
        }
    }
    // takes driver coords from state and sets new progress and leg
    updateDriverData(){
        let firstStop = this._getLegStartfromCoords()[0]
        if(!firstStop) return 'Not a stop on map'
        let firstStopIndex = this.state.stops.indexOf(firstStop)
        let secondStop = this.state.stops[firstStopIndex+1]
        let diff = this._absDiff(firstStop, secondStop)
        // run once for x and for y
        let percent = this._findPercentFromDriverCoords(firstStop, this.state.driverCoords, diff.yDiff, diff.xDiff)
        console.log('percent', percent)
        console.log(firstStop.name)
        let currentLeg = this.state.legs.filter(leg => {
            return leg.startStop === firstStop.name
        })
        let newPositionWpercent = {
            activeLegID: currentLeg[0].legID,
            legProgress: percent.toString()
        }
        console.log(newPositionWpercent)
        this.setState({
            driver: newPositionWpercent
        })
        console.log('new driver state', this.state.driver)
    }
    _resetTruck(){
        this.setState({
            finalDriverMoveObj: {
                directions: {
                    xDir: "left",
                    yDir: "bottom"
                },
                pixels:{
                    moveX: 0,
                    moveY: 0
                }
            }
        })
    }
    _addId() {
        this.uniqueId = this.uniqueId || 0
        return this.uniqueId++
    }
    // renders all truck instances
    renderTrucks(){
        return this.state.finalDriverMoveArr.map((truck,i) => {
            return <Truck coords={truck} key={i} />
        })

    }
    render() {
        let value = 1
    	return(
            <main className="page-container">
                <div className="grid-container">

                    <div className="grid">

                    {this.renderTrucks()}


                    <Stop coords={this.state.stopsDirsArr}/>
                    <Box
                        toRender={this.state.boxesToRender} stopsColor={(this.state.finalStopColorArr.length ? this.state.finalStopColorArr  : null)}
                        legsColor={(this.state.finalLegColorArr.length ? this.state.finalLegColorArr : null)}
                        completeColor={(this.state.finalCompletedColorsArr.length ? this.state.finalCompletedColorsArr : null)}
                    />

                    </div>
                </div>
                <div className="utils-container">

                    <div className="driver-controls">
                        <Tabs onChange={this.handleFormChange.bind(this)}/>

                        <Switch
                            isActive={this.state.isActive}
                            onClick={this.handleSwitchClick.bind(this)}/>
                        {this.state.isActive.button1 ?
                        <Form
                            values={{x:this.state.driverFormX, y:this.state.driverFormY}}
                            onChange={this.handleFormChange.bind(this)}
                            onSubmit={this.handleFormSubmit.bind(this)}/>
                        : <Dropdown
                            values={{x:this.state.driverFormX,y:this.state.driverFormY, driverProgressInput: this.state.driverProgressInput}}
                            type="driver"
                            utils={this.state.utils}
                            legs={this.state.legs.length ? this.state.legs : null}
                            onChange={this.handleDropdownChange} onSubmit={this.handleDropdownSubmit}
                            />
                        }

                    </div>
                <button onClick={this.colorCompletedStops.bind(this)}>Color Completed</button>
                <button onClick={this.colorAllStops.bind(this)}>Color All</button>
                <Dropdown
                    type="color"
                    utils={this.state.utils}
                    legs={this.state.legs.length ? this.state.legs : null}
                    onChange={this.handleDropdownChange} onSubmit={this.handleDropdownSubmit}
                    />
                </div>

            </main>
        )
    }
    handleSwitchClick(e){
        let isActive = Object.assign({}, this.state.isActive)
        if(e.target.name === 'coords'){
            if(!this.state.isActive.button1){
                isActive.button1 = true
                isActive.button2 = false
                this.setState({
                    isActive: isActive
                })
            }
        } else if(e.target.name === 'progress'){
            if(!this.state.isActive.button2){
                isActive.button1 = false
                isActive.button2 = true
                this.setState({
                    isActive: isActive
                })
            }
        } else {
            console.error("error on button click")
        }
    }
    handleDropdownChange(e) {
        if(e.target.name === 'driver-select'){
            this.setState({driverLegInput: e.target.value})
        } else if(e.target.name === 'color-select'){
            console.log('color')
            this.setState({
                value: e.target.value,
                legToColorID: e.target.value
            })
        } else if(e.target.name === 'progressInput') {
            this.setState({driverProgressInput:e.target.value})
        }
    }
    handleDropdownSubmit(event) {

        event.preventDefault()

        if(event.target.name === 'driver'){
            if(this.state.driverLegInput){
                let progress
                if(!this.state.driverProgressInput){
                    progress = 0
                } else {
                    progress = this.state.driverProgressInput
                }
                //update driver position in state
                this.setState({
                    driver:{
                        activeLegID: this.state.driverLegInput,
                        legProgress: progress
                    }
                })
                // update driver position on API
                fetch('/driver', {
                    method: "PUT",
                    headers: {
                        'Accept': 'application/json, text/plain, */*',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        activeLegID: this.state.driverLegInput,
                        legProgress: progress
                    })
                })
                .then(res=>res.json())
                .then(res => console.log('r',res));

                let that = this
                setTimeout(function(){
                    console.log('driver func')
                    // that.addDriver()
                    that.colorCompleted(that.state.driver.activeLegID)

                },100)
            }
        } else if(event.target.name === 'color'){
            this.colorLeg(this.state.legToColorID)
            // console.log(this.state.holdingCompletedArrs)
            // let merged = [].concat.apply([], this.state.holdingCompletedArrs);
            // console.log(merged)
            // this.setState({
            //     finalCompletedColorsArr: merged
            // })

        }
        // this.colorLeg(this.state.value)

    }
    // hold vals in input until next entered
    handleFormChange(evt) {
        console.log(evt.target.value)
        if(evt.target.name === 'x'){
            this.setState({
                driverFormX: evt.target.value
            })

        } else if(evt.target.name === 'y'){
            this.setState({
                driverFormY: evt.target.value,

            })
        } else if(evt.target.name === 'position-select'){

        }

    }
    handleFormSubmit(event) {
        event.preventDefault();
        // update coords
        //set driver to those
            //UPDATE STATE DATA
            let formData = {}
            // set to new input. If blank use the previous one
            if(this.state.driverFormX){
                formData['x'] = parseInt(this.state.driverFormX)
            } else {
                formData['x'] = this.state.driverCoords.x
            }
            if(this.state.driverFormY){
                formData['y'] = parseInt(this.state.driverFormY)
            } else {
                formData['y'] = this.state.driverCoords.y
            }
            this.setState({
                driverCoords: formData
            })
            //ACTUALLY MOVE DRIVER
            this.setDriverWithCoords()
        let that = this
        setTimeout(function(){
            //UPDATE DRIVER DATA
            that.updateDriverData()
            that.colorCompleted(that.state.driver.activeLegID)
        },100)
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
    _setStopCoords(type,x,y){
        // console.log(type)
        let that = this
        let coordsArr = []

            // filter out undefined
            if(type === 'stop'){
                setTimeout(function(){
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
            },1050)
            } else if(type === 'driver'){
                let pixels = that._convertToPixels(
                    x, y
                )
                let coords = {
                    pixels: pixels,
                    directions: {
                        xDir: "left",
                        yDir: "bottom"
                    }
                }
                return coords
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


    }
    componentDidMount() {
        let that = this

        setTimeout(function(){
            // console.log(that.state.legs)
            that.state.stops.map(stop => {
                    that.legStartEnd(stop.x, stop.y,'all')
                    that.colorGrid(stop.x, stop.y, 'all')

            })
            that.addDriver(that.state.currentDriver)
            that.colorCompleted(that.state.currentDriver.activeLegID)
            console.log('state', that.state)
            // that.pleted(that.state.driverCoords.y)
            // console.log('state',that.state)
        },100)



        // call to set stops and truck
        this._setStopCoords('stop')
        // Call our fetch function below once the component mounts
        this._callDriver()
        .then(res => {
            // console.log('r', res)
            this.setState({ currentDriver: res.driver })
        })
        .catch(err => console.log(err));
        this._callStops()
        .then(res => {
            // console.log(res)
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
