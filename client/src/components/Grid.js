import React, { Component } from "react";
import { Manager, Reference, Popper, Arrow } from "react-popper";

import "../App.css";
import Box from './Box'
import Stop from './Stop'
import Truck from './Truck'
import Tabs from './material/Tabs'
import Snackbar from './material/Snackbar'
import Slider from './material/Slider'
import Checkbox from './material/Checkbox'
import utils from './grid_utils'
import MaterialForm from './material/MaterialForm'

class Grid extends Component {
	constructor(props) {
		super(props);
		this.state = {
            setGraphSize: {"x":"50", "y":"50"},
            storeGraphSize: this.setGraphSize,
            cancelSlide: false,
            sliderSlicedChunk: [],
            previousXSlideCoord: {x: 0},
            previousYSlideCoord: {y: 0},
            iconStartAtfirstStop: false,
            sliderIndex:0,
            initialSliderChange: true,
            sliderCoordsArrs: [],
            utilsTop: '',
            colors: ['red', 'Orange', 'DodgerBlue', 'MediumSeaGreen', 'Violet','SlateBlue', 'Tomato'],
            floatToggle: false,
            showStopNames: false,
            snackbarOpen: false,
            allColorsCounter: 0,
            legColorsCounter: 0,
            completedColorsCounter: 0,
            colorType: "",
            loadingDataArr: [],
            // changes based on tab click
            selectedDriverIndex: 0,
            // used to assign driver id on creation
            createCounter:0,
            legs: [],
			stops: [],
            stopsCopy: [],
            legToColorID:"",
            driverFormX:"",
            driverFormY:"",
            driverLegInput:"",
            driversArr: [],
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
            finalLegColorObj: [],
            finalCompletedColorsArr: [],
            finalDriverMoveObj: "",
            finalSliderCoords: [],
            legStartEndCellNums: [],
            texts: {
                driverText: "Select leg for driver",
                colorText: "Select a Leg to color"
            }
		};

        // this.ange = this.handleChange.bind(this);


	}
    createGraph(){
        let that = this
        // take state of graph and multiple to get num
        let cells = parseInt(this.state.setGraphSize.x) * parseInt(this.state.setGraphSize.y)
        console.log(cells)
            that.setState({
                boxesToRender:Array.from({length: cells}, (v, i) => i)
            })
            let root = document.documentElement;
            root.style.setProperty('--graph-size-x',  this.state.setGraphSize.x);
            root.style.setProperty('--graph-size-y', this.state.setGraphSize.y);
            // console.log(root.style)

    }
    // takes and x/y and returns px to moveutils._convertToPixels(x,y){
    //     if(!x){
    //         x = 0
    //     }
    //     if(!y){
    //         y =0
    //     }
    //     let totalX
    //     let totalY
    //     // first 10 cells = 100px
    //     // after that everythig 11px
    //     // - minus cells add 100px
    //     // - rest * 11 then sum
    //     if(x > 10){
    //         x = x - 10
    //         totalX = 100 + (x * 11)
    //     } else {
    //         totalX = x * 10
    //     }
    //     if(y > 10){
    //         y = y - 10
    //         totalY = 100 + (y * 11)
    //     } else {
    //         totalY = y * 10
    //     }
    //     let moveX = parseInt(totalX)
    //     let moveY = parseInt(totalY)
    //     // console.log('mx', moveX)
    //     // console.log('my', moveY)
    //     let coordsObj = {
    //         moveX: moveX,
    //         moveY: moveY
    //     }
    //     return coordsObj
    // }
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

        return {xNum, yNum}

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
        console.log('x', xToMove)
        console.log('y', yToMove)
        return {
            x: xToMove,
            y: yToMove
        }
    }
    // update createCounter by 1
    increaseDriverIdindex(){
        // console.log('called')
        let x = this.state.createCounter + 1
        // console.log(index)
        this.setState({
            createCounter: x
        })
        // console.log('new Index', this.state.createCounter)
    }
    // new add driver - runs on mount and when add button clicked
    addNewDriver(){

        let newDriverObj = {
            directions: {
                xDir: "left",
                yDir: "bottom"
            },
            pixels:{
                moveX: 0,
                moveY: 0
            },
            id: this.state.createCounter,
            name: `driver ${this.state.createCounter + 1}`,
            color: this.state.colors[this.state.createCounter]
        }
        // console.log('id',newDriverObj.id)
        let arr = []
        arr.push(newDriverObj)
        let allDrivers = this.state.driversArr.concat(arr)
        // console.log(allDrivers)
        this.setState({
            driversArr: allDrivers
        })
        this.increaseDriverIdindex()
        this.changeDriver('new-driver', newDriverObj.id)

    }
    // make new driver the selectedDriver on add
    changeDriver(type, driverID){
        //set new driver to be the selectedDriver
        if(type === 'new-driver')
            this.setState({
                selectedDriverIndex: driverID,
                colorType: ""
            })
        else if(type === 'change-driver'){
            this.setState({
                selectedDriverIndex: driverID,
            })
        }
        let that = this
        setTimeout(function(){
            // console.log(that.state.selectedDriverIndex)

        })

    }
    removeDriver(event){
        // get the full name of the driver
        let driverName = event.substring(6,14)
        // filter out driver by that name
        let driver = this.state.driversArr.filter(obj => {
             return (obj.name === driverName.toLowerCase() ? obj : false)
        })
        // console.log(this.state.driversArr)
        // change to next available one lower than the deleted one
        for (var i = this.state.driversArr.length - 1; i >= 0; i--) {
            if(driver[0].id > this.state.driversArr[i].id){
                this.changeDriver('change-driver', this.state.driversArr[i].id)
            }
        }
        console.log(this.state.driversArr)
        let that = this
        setTimeout(function(){

            let index = that.state.driversArr.indexOf(driver[0])
            // splice out of driversArr
            that.state.driversArr.splice(index,1)
            that.setState({
                driversArr: that.state.driversArr
            })
            console.log(that.state.driversArr)
        })
    }
    // runs on load using pre-loaded data and when form submitted
    updateDriverwithData(driverData){
        let selectedDriver = this.state.driversArr[this.state.selectedDriverIndex]
        // console.log(selectedDriver)
        // get from api or form
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
        let { x, y } = this._getDriverCoords(firstStopOfLeg[0], lastStopOfLeg[0], numToMove)
        console.log(x, y)
        let moves = this._getDriverCoords(firstStopOfLeg[0], lastStopOfLeg[0], numToMove)
        // convert the number to move to pixels
        let driverProgressinPixels = utils._convertToPixels(x, y)
        console.log(driverProgressinPixels)
        //
        selectedDriver.pixels = driverProgressinPixels
        selectedDriver.data = driverData

        selectedDriver.driverCoords = moves


        this.state.driversArr[this.state.selectedDriverIndex] = selectedDriver
        console.log('update', this.state.driversArr)
        console.log('update', this.state.driversArr)


        this.setState({
            driversArr: this.state.driversArr
        })
        // console.log('after', this.state.driversArr)
    }
    // on click set driver with coords and send to child
    updateDriverWithCoords(coords, type){
        let selectedDriver = this.state.driversArr[this.state.selectedDriverIndex]
        let driversArr = [...this.state.driversArr]
         if(type === "form"){
            // reset to zero
            this._resetTruck()
            // from form
            coords = this._setStopCoords('driver',
            this.state.driverFormX, this.state.driverFormY)
            // toggle driver to first stop of map start
        } else if(type === "checkbox"){
            if(this.state.iconStartAtfirstStop){
                coords = this._setStopCoords('driver',
                coords.x, coords.y)
                selectedDriver.driverCoords.x = this.state.stops[0].x
                selectedDriver.driverCoords.y = this.state.stops[0].y
                console.log('S', selectedDriver)
                this.setState({
                    driversArr: driversArr
                })
                this.updateDriverData()
                // else start at beginning
            } else if(!this.state.iconStartAtfirstStop){
                coords = this._setStopCoords('driver',
                coords.x, coords.y)
                selectedDriver.driverCoords.x = 0
                selectedDriver.driverCoords.y = 0
                this.setState({
                    driversArr: driversArr
                })
                this.updateDriverData()
            }

        } else if(type === "slider"){
            // reset to zero
            // this._resetTruck()
            // from params

            coords = this._setStopCoords('driver',
            coords.x, coords.y)
        } else if(type === "manual"){
            // reset to zero
            this._resetTruck()
            coords = this._setStopCoords('driver', coords.x, coords.y)
            driversArr[this.state.selectedDriverIndex].driverCoords = {x: 0, y: 0}
        }
        // console.log(coords)
        // subtract for icon positionSelect
        coords.pixels.moveX = coords.pixels.moveX - 30
        // console.log(driversArr[this.state.selectedDriver])
        // update the values in the object
        driversArr[this.state.selectedDriverIndex].directions = coords.directions
        driversArr[this.state.selectedDriverIndex].pixels = coords.pixels
        //console.log(driversArr)
        // set new driver vals
        this.setState({
            driversArr: driversArr
        })
    }
    // calc up to driver position to color
    colorCompleted(legID, type){
        let selectedDriver = this.state.driversArr[this.state.selectedDriverIndex]
    	var arr = this.state.legs.filter(leg => {
    		return leg.legID === legID
    	})
        // console.log(selectedDriver)
        //index for arr of cell nums
        let holdingArrIndex = this._legIndex(arr[0].legID)
        // console.log(holdingArrIndex)
        // index for json with legs info
        let dataIndex = this.state.legs.indexOf(arr[0])
        // console.log('holding' ,holdingArrIndex)
    	//all previous legs to color
        // var previousLegNames = this.state.legs.slice(0,index)

        // get arr of all previous arrs to cell nums
        // var previousLegArrs = this.state.holdAllLegColorArrs.slice(0, holdingArrIndex)
        //get current arr leg of cell nums
        // var currentLegArr = this.state.holdAllLegColorArrs[holdingArrIndex]
        // console.log('previouslegs', previousLegArrs)
        // console.log('currnt arr', currentLegArr)
        // get current and next leg json info
        let thisLeg = this.state.legs[dataIndex]

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
        // console.log(stopStartCoords)
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
        // console.log(selectedDriver)
        if(type === "data"){
            // console.log(selectedDriver)
            this.legStartEnd(selectedDriver.driverCoords.x,selectedDriver.driverCoords.y, 'partial')
        } else if(type === "coords"){
            this.legStartEnd(selectedDriver.driverCoords.x,selectedDriver.driverCoords.y, 'partial')
        }

    }
    colorGrid(x, y, type){

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
        // console.log('fired')
        // let arr = [1,2,3,4,5]
        // let stops = [
        //     {x:20, y:10},
        //     {x: 20, y: 20}
        //     // {x: 25, y: 30},
        //     // {x: 25, y: 80}
        // ]
        // let that = this
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
    // takes driver coords and finds the leg start
    _getLegStartfromCoords(){
        let selectedDriver = this.state.driversArr[this.state.selectedDriverIndex]
        let coords = selectedDriver.driverCoords
        // console.log('driver coords', coords)
        // if x & y is between the stops
        let firstStop = this.state.stops.filter((coord, index) => {
            let stop1 = this.state.stops[index]
            let stop2 = this.state.stops[index + 1]
            // console.log('stop1', stop1)
            // console.log('stop2', stop2)
            // console.log('x',coords.x)
            // console.log('y', coords.y)
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
                // first stop  on map with nothing previous
            } else if(index === 0 && (coord === this.state.stops[0])){
                // console.log('first stop on map')
                    return coord
            } else {
                // not within the stops
                return null
            }
        })
                // console.log('return firstStop', firstStop)
        return firstStop
    }
    // takes first stop obj, driver coords obj, and abs diff of a single stops axis
    _findPercentFromDriverCoords(firstStop, driverCoords, yAbsDiff, xAbsDiff){
        let x1 = parseInt(firstStop.x)
        let y1 = parseInt(firstStop.y)
        let x2 = parseInt(driverCoords.x)
        let y2 = parseInt(driverCoords.y)
        // console.log(driverCoords)
        // console.log('1', x1)
        // console.log('2', y1)
        // console.log('3', x2)
        // console.log('4', y2)
        let xDiff
        let yDiff
        // console.log('xAbsDiff', xAbsDiff)
        // console.log('yAbsDiff', yAbsDiff)
        // find number moved from last stop
        if(x1 < x2){
            // console.log('run 1')
            // console.log(firstStopOfLeg[0].x)
            // console.log(lastStopOfLeg[0].x)
            xDiff = x2 - x1
            // console.log(xToMove)
        } else if(x1 > x2){
            // console.log('run 2')
            xDiff = x1 - x2
        }  else if(x1 === x2){
            xDiff = 0
            // if it's first stop with no second stop
        // } else if(!x2 && !y2)
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
        // console.log('xDiff', xDiff)
        // console.log('yDiff', yDiff)
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
            // console.log('xdiff', xDiff)
            xPercent = xDiff / xAbsDiff
        }
        if(yDiff && yDiff !== 0){
            // console.log('yDiff',yDiff)
            yPercent = yDiff / yAbsDiff
        }
        let finalPercent
        // console.log(xPercent)
        // console.log(yPercent)
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

        // console.log('x%',xPercent)
        // console.log('y%',yPercent)
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
        let selectedDriver = this.state.driversArr[this.state.selectedDriverIndex]
        // console.log('selectedDriver', this.state.selectedDriverIndex)
        let firstStop = this._getLegStartfromCoords()[0]
        // only works with map stops!
        if(!firstStop){
            console.error('Not a map stop')
            return false

        }
        let firstStopIndex = this.state.stops.indexOf(firstStop)
        let secondStop = this.state.stops[firstStopIndex+1]
        let diff = this._absDiff(firstStop, secondStop)
        // console.log(selectedDriver.driverCoords)
        // run once for x and for y
        let percent = this._findPercentFromDriverCoords(firstStop, selectedDriver.driverCoords, diff.yDiff, diff.xDiff)
        // /console.log('percent', percent)
        // console.log(firstStop.name)
        let currentLeg = this.state.legs.filter(leg => {
            return leg.startStop === firstStop.name
        })
        let newPositionWpercent = {
            activeLegID: currentLeg[0].legID,
            legProgress: percent.toString()
        }
        //  console.log(newPositionWpercent)
        let driversArr = [...this.state.driversArr]
        // console.log(driversArr[this.state.selectedDriverIndex])
        // console.log(selectedDriver)
        // update the values in the object

        selectedDriver.data = newPositionWpercent

        // console.log(selectedDriver)
        driversArr[this.state.selectedDriverIndex] = selectedDriver
        // console.log(driversArr)
        this.setState({
            driversArr: driversArr,
            selectedDriver: newPositionWpercent
        })
        // console.log(newPositionWpercent)

        // console.log('new driver state', this.state.selectedDriver)
        return true
    }
    // resets data but does not move
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
    // renders all truck instances
    renderTrucks(props){
        if(this.state.driversArr){
                return this.state.driversArr.map((driverData,i) => {
                // console.log(driverData)
                return <Truck coords={driverData} key={i} colors={this.state.colors} counter={this.state.createCounter}/>
            })
        } else {
            return null
        }

    }
    handleStyle(){
        // set to false temorarily
        if(this.state.floatToggle){
            if(this.state.utilsTop){
                return {
                    bottom: this.state.utilsTop.toString() + "px"
                }
            } else {
                return null
            }
        } else {
            return null
        }

    }

     render() {
    	return(
            <main className="page-container">

                <div className="grid-container" style={this.handleStyle.bind(this)()}>
                    <div className="grid">
                        {this.renderTrucks()}


                        <Stop
                            coords={this.state.stopsDirsArr}
                            toggleStopNames={this.state.showStopNames}/>
                        <Box
                            toRender={this.state.boxesToRender} stopsColor={(this.state.finalStopColorArr.length ? this.state.finalStopColorArr  : null)}
                            legsColor={(this.state.finalLegColorObj ? this.state.finalLegColorObj : null)}
                            completeColor={(this.state.finalCompletedColorsArr.length ? this.state.finalCompletedColorsArr : null)}
                            type={this.state.colorType}
                            legColorsCounter={this.state.legColorsCounter}
                            completedColorsCounter={this.state.completedColorsCounter}
                            allColorsCounter={this.state.allColorsCounter}
                            selectedDriver={this.state.selectedDriverIndex}
                        />

                    </div>
                </div>
                <div className={`${this.state.floatToggle? "float-toggle" :""} utils-container`}>
                    <div className="driver-controls">
                        <div className="upper-controls">
                            <Slider
                                label="Driver Position"
                                onChange={this.handleSliderChange.bind(this)}/>

                            <Checkbox
                                value="checkedC"
                                name="icon-start"
                                label="Begin at stop 1"
                                onChange={this.handleChange.bind(this)}/>
                            <MaterialForm
                                graphSize={true}
                                onChange={this.handleChange.bind(this)}
                                onSubmit={this.handleFormSubmit.bind(this)}
                                values={this.state.setGraphSize}
                                formname="graph-size"
                                addedClass="graph-size"
                                buttonsize="small"
                            />
                        </div>
                        <Tabs
                            onChange={this.handleChange.bind(this)}
                            onSubmit={this.handleFormSubmit.bind(this)}
                            onClick={this.handleClick.bind(this)}
                            values={{x:this.state.driverFormX, y:this.state.driverFormY}}
                            legs={this.state.legs ? this.state.legs : null}
                            texts={this.state.texts}
                            driversArr={this.state.driversArr.length ? this.state.driversArr : null}
                            colors={this.state.colors}
                            selectedDriver={this.state.selectedDriverIndex}
                            />

                            <Snackbar
                                snackbarOpen={this.state.snackbarOpen} onClick={this.handleClick.bind(this)}
                            />
                    </div>
                </div>
            </main>
        )
    }
    handleSliderChange(evt){
        let that = this
        // set to false if set to true elsewhere
        if(this.state.cancelSlide){
            this.state.cancelSlide = false
            this.setState({
                cancelSlide: this.state.cancelSlide
            })
        }
        // if slider
        if(evt.value){
            console.log('slider coords', this.state.sliderCoordsArrs)
            console.log('slider coords', this.state.finalSliderCoords)
            // flatten on first use & when when toggleStartCheckbox called
            if(!this.state.finalSliderCoords.length){
                this.setState({
                    finalSliderCoords: this.state.sliderCoordsArrs.flat()
                })
            }
            console.log('final', this.state.finalSliderCoords)
            //manage by leg
            //make giant array of all coords
            //for every slider increment move ten
            let that = this
            function getPreviousSliderState(){
                 let previousState
                    if(that.state.initialSliderChange){
                        previousState = 0
                        that.setState({
                            initialSliderChange: false,
                            previousState: previousState
                            })
                      } else {
                        previousState = that.state.currentState
                          that.setState({
                              previousState: previousState
                          })
                      }
                    let currentState = evt.value
                    that.setState({
                        currentState: currentState
                    })

                }
                getPreviousSliderState()

            function sliderDiff(){
                let diff
                // if first move, previous will be null
                if(!that.state.previousState){
                    diff = that.state.currentState
                } else {
                    diff = that.state.currentState - that.state.previousState
                }
                // console.log('diff', diff)
                return diff
            }
            setTimeout(function(){
                console.log('val', that.state.currentState)
                // console.log('diff', sliderDiff())
                // console.log(that.state.finalSliderCoords)

            },100)
            // move back and forth
            function handleIndexValue(){
                if(that.state.cancelSlide){
                    return
                }
                if(sliderDiff() > 0){
                    that.setState({
                        sliderIndex: that.state.sliderIndex + 1
                    })
                } else if(sliderDiff() < 0){
                    that.setState({
                        sliderIndex: that.state.sliderIndex - 1
                    })
                }
                // console.log('val', that.state.currentState)
                // console.log('diff', sliderDiff())
                console.log('index', that.state.sliderIndex)
            }
            function moveDriver(){
                // when checkbox in toggleStartCheckbox cancel here
                if(that.state.cancelSlide){
                    console.log('CANCEL')
                    return
                }
                // if zero cannot movebackwards
                console.log('state',that.state.finalSliderCoords)
                if(!that.state.slideIndex){
                 //    console.log('index', that.state.sliderIndex)
                    console.log('state',that.state.finalSliderCoords)
                 // console.log(that.state.finalSliderCoords[that.state.sliderIndex])
                    if((!that.state.finalSliderCoords[that.state.sliderIndex]) && (!that.state.finalSliderCoords[that.state.sliderIndex] )){
                        console.error("Cannot move backwards past beginning of graph.")
                        return
                    }
                }
                let currentDriver = that.state.driversArr[that.state.selectedDriverIndex]


                that.updateDriverWithCoords({
                    x: that.state.finalSliderCoords[that.state.sliderIndex].x,
                    y: that.state.finalSliderCoords[that.state.sliderIndex].y
                }, "slider")

            }
                var i = 0
                looper(i)
                // move driver x times with delay
                function looper () {
                   setTimeout(function () {
                       if(sliderDiff() >= 0){
                           if (i < sliderDiff()) {
                               handleIndexValue()
                               moveDriver()
                               looper();
                           }
                           i = i + 1
                       } else if(sliderDiff() < 0){
                           if (i > sliderDiff()) {
                               handleIndexValue()
                               moveDriver()
                               looper();
                           }
                           i = i - 1
                       }
                  }, 10)
                }

            // }
            sliderDiff()
        }
    }


    toggleSnackbar(){
        this.state.snackbarOpen = !this.state.snackbarOpen
        console.log(this.state.snackbarOpen)
        this.setState({
            snackbarOpen: this.state.snackbarOpen
        })
        console.log(this.state.snackbarOpen)
        return
    }
    // https://stackoverflow.com/questions/16863917/check-if-class-exists-somewhere-in-parent-vanilla-js/19049101
    hasParentClass(element, checkClass){
        if (element.className.split(' ').indexOf(checkClass)>=0) return true;
        return element.parentNode && this.hasParentClass(element.parentNode, checkClass);
    }
    handleClick(event){
// console.log(event.target)
        if(!event) return
        // console.log(event)
        // For TAB clicks - sending strings back here as return vals
        if(typeof event === 'string'){
            // to remove drivers from tabs
            if(event.includes('icon-click') && event.includes('DRIVER')){
                // don't remove single driver
                if(this.state.driversArr.length > 1){
                    this.removeDriver(event)
                }
                // to detect which driver is selected
            } else if(event.includes('DRIVER') && !event.includes('icon-click')){
                // minus one for zero index
                let driverIndex = parseInt(event[event.length - 2]) - 1
                // change to another driver
                this.changeDriver('change-driver', driverIndex)

            }
            // if events and not strings
        } else {
            if(event.target.classList.contains('add-button')){
                event.stopPropagation()
                // call add new driver
                    this.addNewDriver()

            } else if(event.target.classList.contains('secondary-button')){
            event.stopPropagation()
                if(event.target.dataset.number === "1"){
                    this.colorAllStops()
                    // console.log(this.state.allColorsCounter)
                    this.setState({
                        allColorsCounter: this.state.allColorsCounter + 1,
                        colorType: "all"
                    })
                } else if(event.target.dataset.number === "2"){
                    this.colorCompletedStops()
                    this.setState({
                        completedColorsCounter: this.state.completedColorsCounter + 1,
                        colorType: "complete"
                    })
                }
                // if button and has parent class of snackbar
            } else if(event.target.type === 'button' && this.hasParentClass(event.target, "snackbar") ){
                console.log('oks')
                    // send this to child to close
                    this.setState({
                        snackbarOpen: false
                    })

            }
        }
    }
    handleDropdownChange(e) {
        console.log(e.target.name)
        if(e.target.name === 'driver-select'){
            console.log('here')
            this.setState({driverLegInput: e.target.value})
        } else if(e.target.name === 'color-select'){
            console.log('he')
            this.setState({
                value: e.target.value,
                legToColorID: e.target.value
            })
        }
    }
    onDropdownSubmit(event) {
        let selectedDriver = this.state.driversArr[this.state.selectedDriverIndex]
        console.log(selectedDriver)
        // console.log(event.target.name)
        event.preventDefault()

        if(event.target.name === 'driver-dropdown'){
            // user needs to choose a leg else return
            if(!this.state.driverLegInput) return
            let progress
            if(!this.state.driverProgressInput){
                progress = 0
            } else {
                progress = this.state.driverProgressInput
            }
            let updatedData = {
                activeLegID: this.state.driverLegInput,
                legProgress: progress
            }
            selectedDriver.data = updatedData
            //update driver position in state
            this.setState({
                driversArr: this.state.driversArr
            })

            let that = this
            setTimeout(function(){
                // that.addNewDriver()
                that.updateDriverwithData(selectedDriver.data)
                that.colorCompleted(selectedDriver.data.activeLegID)
                console.log(that.state)
            },100)

        } else if(event.target.name === 'color'){
            this.colorLeg(this.state.legToColorID)

        }

    }
    // hold vals in input until next entered
    handleChange(evt) {
        console.log(evt.target.value)
        // to filter out undefined errors
            if(evt.target.name === 'x' && evt.currentTarget.parentNode.parentNode.parentNode.classList.contains('graph-size')){
            let xVal = evt.target.value
            this.setState(prevState => ({
                storeGraphSize: {
                    ...prevState.storeGraphSize,
                    x: xVal
                }
            }))
            } else if(evt.target.name === 'y' && evt.currentTarget.parentNode.parentNode.parentNode.classList.contains('graph-size')){
                let yVal = evt.target.value
                this.setState(prevState => ({
                    storeGraphSize: {
                        ...prevState.storeGraphSize,
                        y: yVal
                    }
                }))
            } else if(evt.target.name === 'x' && !evt.currentTarget.parentNode.parentNode.parentNode.classList.contains('graph-size')){

                this.setState({
                    driverFormX: evt.target.value
                })
            } else if(evt.target.name === 'y' && !evt.currentTarget.parentNode.parentNode.parentNode.classList.contains('graph-size')){
                this.setState({
                    driverFormY: evt.target.value,
                })
            } else if(evt.target.name === 'position-select'){

            } else if(evt.target.name === 'driver-select'){
                this.setState({driverLegInput: evt.target.value})
            } else if(evt.target.name === 'progress-input'){
                console.log('hi')
                this.setState({driverProgressInput:evt.target.value})
                // comes from names on checkboxes
            } else if(evt.target.name === 'float-toggle'){
                this.state.floatToggle = !this.state.floatToggle

                this.setState({
                    floatToggle: this.state.floatToggle
                })
                let that = this
                // go to bottom on toggle
                setTimeout(function(){
                    that.scrollToBottom()
                })
            } else if(evt.target.name === "stop-name-toggle"){
                this.state.showStopNames = !this.state.showStopNames

                this.setState({
                    showStopNames: this.state.showStopNames
                })
            } else if(evt.target.name === 'color-select'){
                this.setState({
                    value: evt.target.value,
                    legToColorID: evt.target.value
                })
            } else if(evt.target.name === "icon-start"){
                    this.toggleStartCheckbox()



            }
    }
    toggleStartCheckbox(){

        this.state.iconStartAtfirstStop = !this.state.iconStartAtfirstStop
        let setSliderCoords
        let tempSliderIndex
        // if not at first stop, include all coords in slider
        console.log(this.state.sliderSlicedChunk)
        if(this.state.iconStartAtfirstStop){
            // slice off part before start
            this.state.sliderSlicedChunk = this.state.sliderCoordsArrs.splice(0,1)
            // reassign arr without that part
            setSliderCoords = this.state.sliderCoordsArrs
            // console.log("S" ,setSliderCoords)
            tempSliderIndex = 10
            this.updateDriverWithCoords({
                x: this.state.stops[0].x,
                y: this.state.stops[0].y,
            }, "checkbox")
        } else {
            // if at first stop, only allow slider from there
            setSliderCoords = this.state.sliderSlicedChunk.concat(this.state.sliderCoordsArrs)
            console.log('slider', this.state.sliderCoordsArrs)
            tempSliderIndex = 0
            this.updateDriverWithCoords({
                x: 0,
                y: 0
            }, "checkbox")
        }


        this.setState({
            cancelSlide: true,
            iconStartAtfirstStop: this.state.iconStartAtfirstStop,
            sliderCoordsArrs: setSliderCoords,
            sliderIndex: tempSliderIndex,
            // flatten array to remove/add coords when clicked
            finalSliderCoords: setSliderCoords.flat()
        })
        // console.log(this.state.finalSliderCoords)
    }
    // buildFinalSliderArr(arrs){
    //
    // }
    // empty the flatten array on each click - it's rebuilt inside iderChange
    emptyFinalSliderArr(){
        // if arr as len, empty it
        if(this.state.finalSliderCoords.lenght){
            this.setState({
                finalSliderCoords: []
            })
        }
        return
    }
    // add the beginning to the stops
    addStartStop(){
        // make an array including beginning
        let stops = [{
            "name": "A",
            "x": 0,
            "y": 0
        }]
        let arr = stops.concat(this.state.stopsCopy)
        this.setState({
            stopsCopy: arr
        })
    }

    componentDidMount() {
        let that = this
        this.createGraph()
        this.scrollToBottom()
        // make scroll to the correct part of screen
        let utils = document.querySelector('.utils-container')
        let grid = document.querySelector('.grid-container')
        let utilsTop
        setTimeout(function(){
            that.setState({
                utilsTop: utils.offsetHeight
            })
        },500)



        setTimeout(function(){
            // console.log(that.state.legs)
            that.state.stops.map((stop, i) => {
                    that.legStartEnd(stop.x, stop.y,'all')
                    that.colorGrid(stop.x, stop.y, 'all')

            })
            // call these with the default driver on mount
            that.addNewDriver()
            that.updateDriverWithCoords({x:0, y:0}, 'manual' )
            // that.updateDriverwithData(that.state.loadingDataArr[0])
            that.colorCompleted(that.state.loadingDataArr[0].activeLegID, "coords")

            // that.pleted(that.state.driverCoords.y)
            // console.log('state',that.state)
        },100)



        // call to set stops and truck
        this._setStopCoords('stop')
        // Call our fetch function below once the component mounts
        this._callDriver()
        .then(res => {
            // load into ar r. Can be looped over if mutlple drivers
            this.setState({ loadingDataArr: [...this.state.loadingDataArr, res.driver] })
        })
        .catch(err => console.log(err));
        this._callStops()
        .then(res => {
            this.setState({
                stops: res.stops,
                stopsCopy: res.stops.slice()
            })

        })
        .catch(err => console.log(err));
        this._callLegs()
        .then(res => {
            this.setState({ legs: res.legs })
        })
        .catch(err => console.log(err))

        // make array of coords to move icon
        setTimeout(function(){
            // start at first stop
            that.updateDriverWithCoords({
                x: 0,
                y: 0,
            }, "checkbox")
            // start from map beginng
            that.addStartStop()
            // make slider coords
            that.state.stopsCopy.map((stop, index) => {
                if(!that.state.stopsCopy[index + 1]) return
                let { xSlideCoord, ySlideCoord } = that.slideRange(stop, that.state.stopsCopy[index + 1])
                // console.log(xSlideCoord, ySlideCoord)
                that.sliderCoordsCalc(xSlideCoord, ySlideCoord, "stop-coords")
            })
        },500)
        function addElemClass(){
            // add class to slider button so can select it later
            let sliderButton = document.querySelector("[type=button]")
            if(that.hasParentClass(sliderButton, "slider")){
                sliderButton.classList.add("slider-button")
            }
        }
        addElemClass()

    }

    // takes two ranges and combines the arrays
    // calcs where smaller axis points coords should be placed with larger
    // makes arr of arrs of all slider coords to follow
    sliderCoordsCalc(xSlideCoord, ySlideCoord, type){
        let storeArr = []
        let currentLong
        let previousLong
        let currentSmall
        let previousSmall
        // console.log('COORDS', xSlideCoord, ySlideCoord)



        // console.log('C',this.state.currentXSlideCoord)
        // console.log('P', this.state.previousXSlideCoord)
        let xArr = xSlideCoord
        let yArr = ySlideCoord

        // console.log(xArr)
        // console.log(yArr)
        let longerArr
        let shorterArr
        if(xArr.length >= yArr.length){
            longerArr = xArr
            shorterArr = yArr
        } else {
            longerArr = yArr
            shorterArr = xArr
        }
        // store last values of arrs
        let lastXarr = xArr[xArr.length -1]
        let lastYarr = yArr[yArr.length -1]
        if(xArr.length){
            this.setState({ lastXarr })
        }
        if(yArr.length){
            this.setState({ lastYarr })

        }

        // console.log('short',shorterArr)
        // console.log('long',longerArr)
        let obj
        // j runs on all small loop
        let j = 0

        for (var i = 0; i < longerArr.length; i++) {

                // Vals to use while function runs
                // if there and not equal to last, reassign
                if(shorterArr[i] && shorterArr[i] !== currentSmall){
                    currentSmall = shorterArr[i]
                } else {
                    // if not there, use the value in state
                    if(!currentSmall){
                        previousSmall = this.state.previousSmall
                    } else {
                        // if there but the same, use the one stored in current and save to state
                        previousSmall = currentSmall
                        this.setState({previousSmall: previousSmall})
                    }
                }
            if(j < shorterArr.length){
                // loop through both until shorter runs out
                    obj = {
                        [Object.keys(longerArr[i])[0]]: Object.values(longerArr[i])[0],
                        [Object.keys(shorterArr[i])[0]]: Object.values(shorterArr[i])[0]
                    }
            // increase inner loop
                j++
            } else {
                // inside loop already use val stored within the function
                if(i > 0){
                    obj = {
                        [Object.keys(longerArr[i])[0]]: Object.values(longerArr[i])[0],
                        [Object.keys(previousSmall)[0]]: Object.values(previousSmall)[0],
                    }
                    // begginning of loop - get value from state and set it on first loop run
                } else {
                    // if long x, get last y
                    if(Object.keys(longerArr[i])[0] === 'x'){
                        previousSmall = this.state.lastYarr
                        this.setState({previousSmall})
                    } else {
                        // if long y, get last x
                        previousSmall = this.state.lastXarr
                        this.setState({previousSmall})
                    }
                    // console.log('first Run', this.state.previousSmall)
                    obj = {
                        [Object.keys(longerArr[i])[0]]: Object.values(longerArr[i])[0],
                        [Object.keys(previousSmall)[0]]: Object.values(previousSmall)[0],
                    }
                }
            }
            storeArr.push(obj)

            // console.log(' obj', obj)
        }
        // console.log('stops1',this.state.stopsCopy[0])
        // console.log('stops2',this.state.stopsCopy[1])
        // console.log('store',storeArr)

            this.setState({
                sliderCoordsArrs: [...this.state.sliderCoordsArrs, storeArr]
            })

    }

    // creates two rangeArr each x/y  start - stop
    // this sets state for sliderCalcs
    slideRange(startObj, endObj){
        if(!startObj || !endObj) return
        // console.log(startObj)
        let yArr = []
        let xArr = []
        let x1 = startObj.x
        let x2 = endObj.x
        let y1 = startObj.y
        let y2 = endObj.y
        let { xToMove, yToMove } = this._numBetweenStops(startObj, endObj)
        // console.log("x", xToMove)
        // console.log("y", yToMove)
        // find if pos of neg
        let xIsInteger = (xToMove < 0 ? false : true)
        let yIsInteger = (yToMove < 0 ? false : true)
        // make arr of x/y stops
            for (var i = 0; i < Math.abs(yToMove); i++) {
                if(yIsInteger){
                    let obj = {y: y1 + (i + 1)}
                    yArr.push(obj)
                } else {
                    let obj = {y: y1 - (i + 1)}
                    yArr.push(obj)
                }
            }
            for (var i = 0; i < Math.abs(xToMove); i++) {
                if(xIsInteger){
                    let obj = {x: x1 + (i + 1)}
                    xArr.push(obj)
                } else {
                    let obj = {x: y1 - (i + 1)}
                    xArr.push(obj)
                }
            }
        // console.log(xArr)
        // console.log(yArr)
        // push to state
        return {
            xSlideCoord: xArr,
            ySlideCoord: yArr
        }
    }
    // take json and divide into arrs of stop/start
    makeCoordsArrs(){
        let stops = [{
            "name": "A",
            "x": 20,
            "y": 10
            },
            {
            "name": "B",
            "x": 20,
            "y": 20
            },
            {
            "name": "C",
            "x": 25,
            "y": 30
            },
            {
            "name": "D",
            "x": 25,
            "y": 80
        }]
        let arr = []
        stops.map((stop,i) => {
            if(!stops[i + 1]) return
            let start = stops[i]
            let end = stops[i + 1]
            console.log(start, end)
        })
    }
    _numBetweenStops(stop1, stop2){
        let x1 = stop1.x
        let x2 = stop2.x
        let y1 = stop1.y
        let y2 = stop2.y
        // console.log(y1)
        // console.log(y2)
        let xToMove
        let yToMove
        if(x1 > x2){
            xToMove = x1 - x2
            xToMove = -Math.abs(xToMove)
        } else {
            xToMove = x2 - x1
        }

        if(y1 > y2){
            yToMove = y1 - y2
            yToMove = -Math.abs(yToMove)
        } else {
            yToMove = y2 - y1
        }
        return {xToMove, yToMove}

    }
    handleFormSubmit(event) {
        event.preventDefault();
        // console.log(this.state.driversArr)
        // console.log(this.state.selectedDriverIndex)

        if(event.target.name === 'graph-size'){
            this.setState({
                setGraphSize: this.state.storeGraphSize
            })
            return
        }
        let currentDriver = this.state.driversArr[this.state.selectedDriverIndex]
                // update coords
                //set driver to those
            //UPDATE STATE DATA
            if(event.target.name === 'driver-dropdown' || event.target.name === 'color'){
                this.onDropdownSubmit(event)

            } else if(event.target.name === 'driver-form') {
                let formData = {}
                // set to new input. If blank use the previous one
                if(this.state.driverFormX){
                    formData['x'] = parseInt(this.state.driverFormX)
                } else {
                    formData['x'] = currentDriver.driverCoords.x
                }
                if(this.state.driverFormY){
                    formData['y'] = parseInt(this.state.driverFormY)
                } else {
                    formData['y'] = currentDriver.driverCoords.y
                }
                console.log(currentDriver)
                    currentDriver.driverCoords = formData
                console.log(this.state.driversArr)
                this.setState({
                    driverCoords: formData
                })
            //ACTUALLY MOVE DRIVER
            this.updateDriverWithCoords("", "form")
            let that = this
            setTimeout(function(){
                //UPDATE DRIVER DATA
                // returns false if not a stop
                let result = that.updateDriverData()
                if(!result){
                    // not part of route
                    that.toggleSnackbar()
                    return
                }
                that.colorCompleted(that.state.selectedDriver.activeLegID)
                console.log(that.state.selectedDriver.activeLegID)
                console.log(that.state)
            },100)
        }
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
        // console.log(this.state.finalLegColorObj)
        let that = this
        // - get val from Dropdown-
        // change it to an index

        let index = this._legIndex(input)
        // get leg using index out of array
        let leg = this.state.holdAllLegColorArrs[index]
        // set state on child to change the color
        let legObj = {leg, index}
        console.log(legObj)
        this.setState({
            finalLegColorObj: legObj,
            legColorsCounter: this.state.legColorsCounter + 1,
            colorType: "leg"
        })
    }

    // set coords in pxs of plots
    _setStopCoords(type,x,y){
        // console.log(x,y)
        let that = this
        let coordsArr = []

            // filter out undefined
            if(type === 'stop'){
                setTimeout(function(){
                if(that.state.stops.length > 0){
                    that.state.stops.forEach(stop => {
                        // console.log(stop.x, stop.y)
                        let pixels = utils._convertToPixels(
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
                let pixels = utils._convertToPixels(
                    x, y
                )
                let coords = {
                    pixels: pixels,
                    directions: {
                        xDir: "left",
                        yDir: "bottom"
                    }
                }
                // console.log(coords)
                return coords

            }


    }
    scrollToBottom(){
        // console.log('scroll bottom')
        window.scrollTo(0,document.body.scrollHeight)
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
