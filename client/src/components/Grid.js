import React, { Component } from "react";

import "../App.css";
import Box from "./Box";
import Stop from "./Stop";
import Cursor from "./Cursor";
import Tabs from "./material/Tabs";
import Snackbar from "./material/Snackbar";
import utils from "./grid_utils";
import MaterialButton from "./material/MaterialButton";
import Modal from "./material/Modal";

class Grid extends Component {
	constructor(props) {
		super(props);
		this.state = {
			modalState: true,
			setGraphSize: { x: "20", y: "20" },
			storeGraphSize: { x: "20", y: "20" },
			plotObjs: [],
			tempPlotObj: { x: "", y: "" },
			cancelSlide: false,
			sliderSlicedChunk: [],
			iconStartAtfirstStop: false,
			sliderIndex: 0,
			initialSliderChange: true,
			sliderCoordsArrs: [],
			// utilsTop: '',
			colors: [
				"red",
				"Orange",
				"DodgerBlue",
				"MediumSeaGreen",
				"Violet",
				"SlateBlue",
				"Tomato"
			],
			floatToggle: false,
			showStopNames: false,
			snackbarOpen: false,
			allColorsCounter: 0,
			legColorsCounter: 0,
			completedColorsCounter: 0,
			colorType: "",
			loadingDataArr: [],
			cursorIndex: 0,
			createCounter: 0,
			legs: [],
			stops: [],
			jsonStops: [],
			stopsCopy: [],
			legToColorID: "",
			cursorFormX: "",
			cursorFormY: "",
			cursorLegInput: "",
			cursorArr: [],
			cursorInputProgress: "",
			currentCursor: "",
			startingCellNumAll: 0,
			startingCellNumPartial: "",
			previousLegEndCell: 0,
			previousStopX: 0,
			previousStopY: 0,
			previousLegX: 0,
			previousLegY: 0,
			partialLegStartCoords: "",
			partialLegEndCoords: "",
			boxesToRender: Array.from({ length: 100 }, (v, i) => i),
			holdAllStopColorIndexes: [],
			holdAllLegColorArrs: [],
			holdingCompletedArrs: [],
			finalStopColorArr: [],
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
		this.getWindowOffset = this.getWindowOffset.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleClick = this.handleClick.bind(this);
	}
	createGraph() {
		let that = this;
		// take state of graph and multiple to get num
		let cells =
			parseInt(this.state.setGraphSize.x) * parseInt(this.state.setGraphSize.y);
		if(!cells) {
			console.error("No cell values");
			return;
		}
		that.setState({
			boxesToRender: Array.from({ length: cells }, (v, i) => i)
		});
		setCSSvars();
		// sets vals in css to grid size
		function setCSSvars() {
			// console.log(that.state.setGraphSize)
			let root = document.documentElement;
			root.style.setProperty("--graph-size-x", that.state.setGraphSize.x);
			root.style.setProperty("--graph-size-y", that.state.setGraphSize.y);
		}
		setTimeout(function() {
			that.setState({
				startingCellNumAll: utils._calcStartingCell(that.state.setGraphSize)
			});
			that.calcRowVariaion();
		});
	}
	// takes coords and type - needs access to state
	_numToMove(x, y, type) {
		if(type === "stop") {
			let moveX = Math.abs(this.state.previousStopX - x);
			let moveY = Math.abs(this.state.previousStopY - y);
			return {
				tempX: moveX,
				tempY: moveY
			};
		} else if(type === "leg") {
			let moveX = Math.abs(this.state.previousLegX - x);
			let moveY = Math.abs(this.state.previousLegY - y);
			return {
				tempX: moveX,
				tempY: moveY
			};
		} else {
			console.error("error in the num to move function");
		}
	}
	// take amount in leg with a percent - returns num to move out of total leg number
	_percentToCoords(diffObj, percent) {
		let xNum = Math.floor(diffObj.xDiff * 0.01 * percent);
		let yNum = Math.floor(diffObj.yDiff * 0.01 * percent);
		return { xNum, yNum };
	}
	// update createCounter by 1
	increaseCursorIdindex() {
		let x = this.state.createCounter + 1;
		this.setState({
			createCounter: x
		});
	}
	// new add driver - runs on mount and when add button clicked
	addNewCursor() {
		let newCursorObj = {
			directions: {
				xDir: "left",
				yDir: "bottom"
			},
			pixels: {
				moveX: 0,
				moveY: 0
			},
			id: this.state.createCounter,
			name: `cursor ${this.state.createCounter + 1}`,
			color: this.state.colors[this.state.createCounter],
			show: false
		};
		let arr = [];
		arr.push(newCursorObj);
		let allCursors = this.state.cursorArr.concat(arr);
		this.setState({
			cursorArr: allCursors
		});
		this.increaseCursorIdindex();
		this.changeCursor("new-cursor", newCursorObj.id);
	}
	// make new driver the selectedDriver on add
	changeCursor(type, cursorID) {
		//set new driver to be the selectedDriver
		if(type === "new-cursor")
			this.setState({
				cursorIndex: cursorID,
				colorType: ""
			});
		else if(type === "change-cursor") {
			this.setState({
				cursorIndex: cursorID
			});
		}
	}
	removeDriver(event) {
		// get the full name of the driver
		let cursorName = event.event.target.dataset.key;
		// filter out driver by that name
		let cursor = this.state.cursorArr.filter(obj => {
			return obj.name === cursorName.toLowerCase() ? obj : false;
		});
		// change to next available one lower than the deleted one
		for(var i = this.state.cursorArr.length - 1; i >= 0; i--) {
			if(cursor[0].id > this.state.cursorArr[i].id) {
				this.changeCursor("change-cursor", this.state.cursorArr[i].id);
			}
		}
		let that = this;
		setTimeout(function() {
			let index = that.state.cursorArr.indexOf(cursor[0]);
			// splice out of cursorArr
			that.state.cursorArr.splice(index, 1);
			that.setState({
				cursorArr: that.state.cursorArr
			});
		});
	}
	// runs on load using pre-loaded data and when form submitted
	updateCursorwithData(driverData) {
		let selectedDriver = this.state.cursorArr[this.state.cursorIndex];
		// get from api or form
		let legName = driverData.activeLegID;
		// correlate with stops- letters to match stops needed
		let firstLetter = legName[0];
		let secondLetter = legName[1];
		// get stop coords = filter ones that match
		let firstStopOfLeg = this.state.stops.filter(stop => {
			return stop.name === firstLetter;
		});
		let lastStopOfLeg = this.state.stops.filter(stop => {
			return stop.name === secondLetter;
		});
		//calc abs distance bwt coords  - coords for first and last
		let diffObj = utils._absDiff(firstStopOfLeg[0], lastStopOfLeg[0]);
		let progress = parseInt(driverData.legProgress);
		// takes number of moves and percent - returns number of moves that is
		let numToMove = utils._percentToCoords(diffObj, progress);
		// takes coords for first, last and how many -returns up / down & COORDS
		let { x, y } = utils._getDriverCoords(
			firstStopOfLeg[0],
			lastStopOfLeg[0],
			numToMove
		);
		let moves = utils._getDriverCoords(
			firstStopOfLeg[0],
			lastStopOfLeg[0],
			numToMove
		);
		// convert the number to move to pixels
		let driverProgressinPixels = utils._convertToPixels(x, y);
		selectedDriver.pixels = driverProgressinPixels;
		selectedDriver.data = driverData;
		selectedDriver.driverCoords = moves;
		let cursorArrCopy = this.state.cursorArr.slice();
		cursorArrCopy[this.state.cursorIndex] = selectedDriver;

		this.setState({
			cursorArr: cursorArrCopy
		});
	}
	// on click set driver with coords and send to child
	updateDriverWithCoords(coords, type) {
		let selectedDriver = this.state.cursorArr[this.state.cursorIndex];
		let cursorArr = [...this.state.cursorArr];
		if(type === "form") {
			// reset to zero
			this._resetCursor();
			// from form
			coords = this._setStopCoords(
				"driver",
				this.state.cursorFormX,
				this.state.cursorFormY
			);
			// toggle driver to first stop of map start
		} else if(type === "checkbox") {
			if(this.state.iconStartAtfirstStop) {
				coords = this._setStopCoords("driver", coords.x, coords.y);
				selectedDriver.driverCoords.x = this.state.stops[0].x;
				selectedDriver.driverCoords.y = this.state.stops[0].y;
				console.log("S", selectedDriver);
				this.setState({
					cursorArr: cursorArr
				});
				this.updateDriverData();
				// else start at beginning
			} else if(!this.state.iconStartAtfirstStop) {
				coords = this._setStopCoords("driver", coords.x, coords.y);
				selectedDriver.driverCoords.x = 0;
				selectedDriver.driverCoords.y = 0;
				this.setState({
					cursorArr: cursorArr
				});
				this.updateDriverData();
			}
		} else if(type === "slider") {
			// from params
			coords = this._setStopCoords("driver", coords.x, coords.y);
		} else if(type === "manual") {
			// reset to zero
			this._resetCursor();
			coords = this._setStopCoords("driver", coords.x, coords.y);
			cursorArr[this.state.cursorIndex].driverCoords = { x: 0, y: 0 };
		}
		// subtract for icon positionSelect
		coords.pixels.moveX = coords.pixels.moveX - 30;
		// update the values in the object
		cursorArr[this.state.cursorIndex].directions = coords.directions;
		cursorArr[this.state.cursorIndex].pixels = coords.pixels;
		// set new driver vals
		this.setState({
			cursorArr: cursorArr
		});
	}
	// calc up to driver position to color
	colorCompleted(legID, type) {
		let selectedDriver = this.state.cursorArr[this.state.cursorIndex];
		var arr = this.state.legs.filter(leg => {
			// console.log(leg.legID)
			return leg.legID === legID;
		});

		//index for arr of cell nums
		let holdingArrIndex = this._legIndex(arr[0].legID);
		// index for json with legs info
		let dataIndex = this.state.legs.indexOf(arr[0]);
		//all previous legs to color
		// var previousLegNames = this.state.legs.slice(0,index)

		// get arr of all previous arrs to cell nums
		// var previousLegArrs = this.state.holdAllLegColorArrs.slice(0, holdingArrIndex)
		//get current arr leg of cell nums
		// var currentLegArr = this.state.holdAllLegColorArrs[holdingArrIndex]
		// console.log('previouslegs', previousLegArrs)
		// console.log('currnt arr', currentLegArr)
		// get current and next leg json info
		let thisLeg = this.state.legs[dataIndex];
		// console.log(thisLeg)
		let legFirstStop = this.state.stops.filter(stop => {
			return stop.name === thisLeg.startStop;
		});
		// console.log(legFirstStop)
		let legLastStop = this.state.stops.filter(stop => {
			return stop.name === thisLeg.endStop;
		});
		// get first and end coords
		let stopStartCoords = {
			x: legFirstStop[0].x,
			y: legFirstStop[0].y
		};
		let stopEndCoords = {
			x: legLastStop[0].x,
			y: legLastStop[0].y
		};
		// console.log(stopStartCoords)
		// console.log(stopEndCoords)
		// get diff to get number of moves
		// let diffObj = utils._absDiff(stopStartCoords, stopEndCoords)
		// console.log(diff)
		// percent driver is complete of leg
		// let progress = parseInt(this.state.driver.legProgress)
		// // takes number of moves and percent - returns number of moves that is partial of leg in coords
		// let numToMove = utils._percentToCoords(diffObj, progress)
		// console.log('num to move', numToMove)
		// console.log(this.state.legStartEndCellNums)
		// cell nums
		let start = this.state.legStartEndCellNums[holdingArrIndex];
		// console.log('start/end', start, end)
		// set startingCell and start x / y

		// this.state.startingCellNumPartial: start/end cells
		// 24034 34034
		// this.partialLegStartCoords: start x/y
		// {x: 35, y: 80}
		// this.state.partialLegEndCoords: end
		// {x: 35, y: 30}
		var previousLegArrs = this.state.holdAllLegColorArrs.slice(
			0,
			holdingArrIndex
		);

		this.setState({
			startingCellNumPartial: start,
			partialLegStartCoords: stopStartCoords,
			partialLegEndCoords: stopEndCoords,
			holdingCompletedArrs: [...previousLegArrs]
		});
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
		if(type === "data") {
			// console.log(selectedDriver)
			this.legStartEnd(
				selectedDriver.driverCoords.x,
				selectedDriver.driverCoords.y,
				"partial"
			);
		} else if(type === "coords") {
			this.legStartEnd(
				selectedDriver.driverCoords.x,
				selectedDriver.driverCoords.y,
				"partial"
			);
		}
	}
	// calc num of cells to vertial based on grid size
	calcRowVariaion() {
		// formula - move up/down is the same value as x and y
		this.setState({
			moveRowCells: parseInt(this.state.setGraphSize.x)
		});
	}
	colorGrid(x, y, type) {
		// calc num of units to move based on prev position
		let tempCellNumsArr = [];
		let tempX = x;
		let tempY = y;
		let tempCellNum;
		let loopAxis;
		if(type === "all") {
			tempCellNum = this.state.startingCellNumAll;
		}
		// convert based on next move using above function
		tempX = this._numToMove(tempX, tempY, "stop").tempX;
		tempY = this._numToMove(tempX, tempY, "stop").tempY;
		// on first move on grid only - for bottom corner
		if(this.state.previousStopX === 0 && this.state.previousStopY === 0) {
			tempX = tempX - 1;
			tempY = tempY - 1;
			tempCellNumsArr.push(tempCellNum);
		}
		// move in tandem while both vals exist
		while(tempX && tempY) {
			// console.log(this.state.moveRowCells)
			// if last was les than current- do this
			if(this.state.previousStopY < y) {
				tempCellNum = tempCellNum - this.state.moveRowCells;
				tempCellNumsArr.push(tempCellNum);
			} else if(this.state.previousStopY > y) {
				tempCellNum = tempCellNum + this.state.moveRowCells;
				tempCellNumsArr.push(tempCellNum);
			}
			if(this.state.previousStopX < x) {
				tempCellNum = tempCellNum + 1;
				tempCellNumsArr.push(tempCellNum);
			} else if(this.state.previousStopX > x) {
				tempCellNum = tempCellNum - 1;
				tempCellNumsArr.push(tempCellNum);
			}
			tempX = tempX - 1;
			tempY = tempY - 1;
		}
		// axis - loop over the only one left X or Y
		loopAxis = tempY ? (loopAxis = tempY) : (loopAxis = tempX);
		// if only on val left, move on its own
		for(var i = 0; i < loopAxis; i++) {
			if(tempY) {
				if(this.state.previousStopY < y) {
					tempCellNum = tempCellNum - this.state.moveRowCells;
					tempCellNumsArr.push(tempCellNum);
				} else if(this.state.previousStopY > y) {
					tempCellNum = tempCellNum + this.state.moveRowCells;
					tempCellNumsArr.push(tempCellNum);
				}
			} else if(tempX) {
				if(this.state.previousStopX < x) {
					tempCellNum = tempCellNum + 1;
					tempCellNumsArr.push(tempCellNum);
				} else if(this.state.previousStopX > x) {
					tempCellNum = tempCellNum - 1;
					tempCellNumsArr.push(tempCellNum);
				}
			}
		}
		if(type === "all") {
			this.setState({
				previousStopX: x,
				previousStopY: y,
				startingCellNumAll: tempCellNum,
				holdAllStopColorIndexes: [
					...this.state.holdAllStopColorIndexes,
					...tempCellNumsArr
				]
			});
		}
	}
	// takes x y and determine start and end cells
	legStartEnd(x, y, type) {
		let tempCellNumsArr = [];
		let tempX = x;
		let tempY = y;
		// start remains the same
		let tempStartNum;
		// cell num changes with calcs
		let tempCellNum;
		let loopAxis;
		if(type === "all") {
			// on first move only
			if(this.state.previousLegEndCell === 0) {
				tempStartNum = this.state.startingCellNumAll;
				tempCellNum = this.state.startingCellNumAll;
			} else {
				tempStartNum = this.state.previousLegEndCell;
				tempCellNum = this.state.previousLegEndCell;
			}
		} else if(type === "partial") {
			// start of leg
			tempCellNum = this.state.startingCellNumPartial;
			// need to reset previous x and y
			this.setState({
				previousLegX: this.state.partialLegStartCoords.x,
				previousLegY: this.state.partialLegStartCoords.y
			});
		}
		// convert based on next move using above function
		({ tempX, tempY } = this._numToMove(tempX, tempY, "leg"));
		// on first move on grid only - for bottom corner
		if(this.state.previousLegX === 0 && this.state.previousLegY === 0) {
			tempX = tempX - 1;
			tempY = tempY - 1;
			tempCellNumsArr.push(tempCellNum);
		}
		// move in tandem while both vals exist
		while(tempX && tempY) {
			// if last was les than current- do this
			if(this.state.previousLegY < y) {
				tempCellNum = tempCellNum - this.state.moveRowCells;
				tempCellNumsArr.push(tempCellNum);
			} else if(this.state.previousLegY > y) {
				tempCellNum = tempCellNum + this.state.moveRowCells;
				tempCellNumsArr.push(tempCellNum);
			}
			if(this.state.previousLegX < x) {
				tempCellNum = tempCellNum + 1;
				tempCellNumsArr.push(tempCellNum);
			} else if(this.state.previousLegX > x) {
				tempCellNum = tempCellNum - 1;
				tempCellNumsArr.push(tempCellNum);
			}
			tempX = tempX - 1;
			tempY = tempY - 1;
		}
		// axis - loop over the only one left X or Y
		loopAxis = tempY ? (loopAxis = tempY) : (loopAxis = tempX);
		// if only on val left, move on its own
		for(var i = 0; i < loopAxis; i++) {
			if(tempY) {
				if(this.state.previousLegY < y) {
					tempCellNum = tempCellNum - this.state.moveRowCells;
					tempCellNumsArr.push(tempCellNum);
				} else if(this.state.previousLegY > y) {
					tempCellNum = tempCellNum + this.state.moveRowCells;
					tempCellNumsArr.push(tempCellNum);
				}
			} else if(tempX) {
				if(this.state.previousLegX < x) {
					tempCellNum = tempCellNum + 1;
					tempCellNumsArr.push(tempCellNum);
				} else if(this.state.previousLegX > x) {
					tempCellNum = tempCellNum - 1;
					tempCellNumsArr.push(tempCellNum);
				}
			}
		}
		let legCellNums = {
			start: tempStartNum,
			end: tempCellNum
		};
		// - make this previousLast
		if(type === "all") {
			this.setState({
				previousLegEndCell: tempCellNum,
				previousLegX: x,
				previousLegY: y,
				legStartEndCellNums: [...this.state.legStartEndCellNums, legCellNums],
				holdAllLegColorArrs: [
					...this.state.holdAllLegColorArrs,
					tempCellNumsArr
				]
			});
		} else if(type === "partial") {
			this.setState({
				previousStopX: x,
				previousStopY: y,
				startingCellNumPartial: tempCellNum,
				holdingCompletedArrs: [
					...this.state.holdingCompletedArrs,
					tempCellNumsArr
				]
			});
		}
	}
	// send colored stops to child
	colorAllStops() {
		this.setState({
			finalStopColorArr: this.state.holdAllStopColorIndexes
		});
	}
	// on click pass props to child
	colorCompletedStops() {
		console.log(this.state.holdingCompletedArrs);
		let merged = [].concat.apply([], this.state.holdingCompletedArrs);
		this.setState({
			finalCompletedColorsArr: merged
		});
	}
	// takes driver coords and finds the leg start
	_getLegStartfromCoords() {
		let selectedDriver = this.state.cursorArr[this.state.cursorIndex];
		let coords = selectedDriver.driverCoords;
		// if x & y is between the stops
		let firstStop = this.state.stops.filter((coord, index) => {
			let stop1 = this.state.stops[index];
			let stop2 = this.state.stops[index + 1];
			if(stop2 === undefined) return false;
			if(
				//x/y are both btw
				((coords.y > stop1.y && coords.y < stop2.y) ||
					(coords.y < stop1.y && coords.y > stop2.y)) &&
				((coords.x > stop1.x && coords.x < stop2.x) ||
					(coords.x < stop1.x && coords.x > stop2.x))
			) {
				return coord;
			} else if(
				// y is bwn and x is equal
				((coords.y > stop1.y && coords.y < stop2.y) ||
					(coords.y < stop1.y && coords.y > stop2.y)) &&
				(coords.x === stop1.x && coords.x === stop2.x)
			) {
				return coord;
			} else if(
				// x is bwn and y is equal
				((coords.x > stop1.x && coords.x < stop2.x) ||
					(coords.x < stop1.x && coords.x > stop2.x)) &&
				(coords.y === stop1.y && coords.y === stop2.y)
			) {
				return coord;
			} else if(
				//coords are exact match
				coords.x === stop1.x &&
				coords.y === stop1.y
			) {
				return coord;
				// first stop  on map with nothing previous
			} else if(index === 0 && coord === this.state.stops[0]) {
				// console.log('first stop on map')
				return coord;
			} else {
				// not within the stops
				return null;
			}
		});
		return firstStop;
	}
	// takes driver coords from state and sets new progress and leg
	updateDriverData() {
		let selectedDriver = this.state.cursorArr[this.state.cursorIndex];
		let firstStop = this._getLegStartfromCoords()[0];
		// only works with map stops!
		if(!firstStop) {
			console.error("Not a map stop");
			return false;
		}
		let firstStopIndex = this.state.stops.indexOf(firstStop);
		let secondStop = this.state.stops[firstStopIndex + 1];
		let diff = utils._absDiff(firstStop, secondStop);
		// run once for x and for y
		let percent = utils._findPercentFromDriverCoords(
			firstStop,
			selectedDriver.driverCoords,
			diff.yDiff,
			diff.xDiff
		);
		let currentLeg = this.state.legs.filter(leg => {
			return leg.startStop === firstStop.name;
		});
		let newPositionWpercent = {
			activeLegID: currentLeg[0].legID,
			legProgress: percent.toString()
		};

		let cursorArr = [...this.state.cursorArr];
		// update the values in the object
		selectedDriver.data = newPositionWpercent;
		cursorArr[this.state.cursorIndex] = selectedDriver;
		this.setState({
			cursorArr: cursorArr,
			selectedDriver: newPositionWpercent
		});
		return true;
	}
	// resets data but does not move
	_resetCursor() {
		this.setState({
			finalDriverMoveObj: {
				directions: {
					xDir: "left",
					yDir: "bottom"
				},
				pixels: {
					moveX: 0,
					moveY: 0
				}
			}
		});
	}
	// renders all truck instances
	renderCursor() {
		if(this.state.cursorArr && Array.isArray(this.state.cursorArr)) {
			return this.state.cursorArr.map((driverData, i) => {
				return ( <
					Cursor show = { driverData.show } coords = { driverData } key = { i } colors = { this.state.colors } counter = { this.state.createCounter }
					/>
				);
			});
		} else {
			return null;
		}
	}
	// position utils-container based on size with graph
	handleStyle() {
		// set to false temorarily
		if(this.state.floatToggle) {
			if(this.state.utilsTop) {
				return {
					marginBottom: this.state.utilsTop.toString() + "px"
				};
			} else {
				return null;
			}
		} else {
			return null;
		}
	}
	render() {
		return ( <
			main className = "page-container" >
			<
			div className = "water-mark" >
			IN DEVELOPMENT <
			/div>   <
			Modal open = { this.state.modalState } cells = {
				Math.sqrt(
					parseInt(this.state.setGraphSize.x) *
					parseInt(this.state.setGraphSize.y)
				)
			}
			onChange = { this.handleChange } onSubmit = { this.handleSubmit } plots = { this.state.plotObjs.length ? this.state.plotObjs : undefined }
			/>{" "} <
			div className = "grid-container"
			style = { this.handleStyle.bind(this)() } >
			<
			div className = "grid" > { " " } { this.renderCursor() } { " " } <
			Stop coords = { this.state.stopsDirsArr } toggleStopNames = { this.state.showStopNames }
			/>{" "} <
			Box toRender = { this.state.boxesToRender } stopsColor = {
				this.state.finalStopColorArr.length ?
				this.state.finalStopColorArr :
					null
			}
			legsColor = {
				this.state.finalLegColorObj ? this.state.finalLegColorObj : null
			}
			completeColor = {
				this.state.finalCompletedColorsArr.length ?
				this.state.finalCompletedColorsArr :
					null
			}
			type = { this.state.colorType } legColorsCounter = { this.state.legColorsCounter } completedColorsCounter = { this.state.completedColorsCounter } allColorsCounter = { this.state.allColorsCounter } selectedDriver = { this.state.cursorIndex }
			/>{" "} <
			/div>{" "} <
			/div>{" "} <
			div className = { `${
            this.state.floatToggle ? "float-toggle" : ""
          } utils-container` } >
			<
			div className = "driver-controls" >
			<
			div className = "upper-controls" >
			<
			MaterialButton onClick = { this.handleClick } buttonNumber = { 4 } size = "small"
			text = "Show Window"
			type = "primary-button"
			color = "default" /
			>
			<
			/div>{" "} <
			Tabs onChange = { this.handleChange } onSubmit = { this.handleSubmit } onClick = { this.handleClick } values = { { x: this.state.cursorFormX, y: this.state.cursorFormY } } legs = { this.state.legs ? this.state.legs : null } texts = { this.state.texts } cursorArr = {
				this.state.cursorArr.length ? this.state.cursorArr : null
			}
			colors = { this.state.colors } selectedDriver = { this.state.cursorIndex }
			/>{" "} <
			Snackbar snackbarOpen = { this.state.snackbarOpen } onClick = { this.handleClick }
			/>{" "} <
			/div>{" "} <
			/div>{" "} <
			/main>
		);
	}

	handleModalOpenClose() {
		this.setState({
			modalState: utils._toggleState(this.state.modalState)
		});
	}
	handleSliderChange(evt) {
		// set to false if set to true elsewhere
		if(this.state.cancelSlide) {
			this.setState({
				cancelSlide: utils._toggleState(this.state.cancelSlide)
			});
		}
		// if slider
		if(evt.value) {
			console.log("slider coords", this.state.sliderCoordsArrs);
			console.log("slider coords", this.state.finalSliderCoords);
			// flatten on first use & when when toggleStartCheckbox called
			if(!this.state.finalSliderCoords.length) {
				this.setState({
					finalSliderCoords: this.state.sliderCoordsArrs.flat()
				});
			}
			console.log("final", this.state.finalSliderCoords);
			//manage by leg
			//make giant array of all coords
			//for every slider increment move ten
			let that = this;

			function getPreviousSliderState() {
				let previousState;
				if(that.state.initialSliderChange) {
					previousState = 0;
					that.setState({
						initialSliderChange: false,
						previousState: previousState
					});
				} else {
					previousState = that.state.currentState;
					that.setState({
						previousState: previousState
					});
				}
				let currentState = evt.value;
				that.setState({
					currentState: currentState
				});
			}
			getPreviousSliderState();

			function sliderDiff() {
				let diff;
				// if first move, previous will be null
				if(!that.state.previousState) {
					diff = that.state.currentState;
				} else {
					diff = that.state.currentState - that.state.previousState;
				}
				// console.log('diff', diff)
				return diff;
			}
			setTimeout(function() {
				console.log("val", that.state.currentState);
				// console.log('diff', sliderDiff())
				// console.log(that.state.finalSliderCoords)
			}, 100);
			// move back and forth
			function handleIndexValue() {
				if(that.state.cancelSlide) {
					return;
				}
				if(sliderDiff() > 0) {
					that.setState({
						sliderIndex: that.state.sliderIndex + 1
					});
				} else if(sliderDiff() < 0) {
					that.setState({
						sliderIndex: that.state.sliderIndex - 1
					});
				}
				// console.log('val', that.state.currentState)
				// console.log('diff', sliderDiff())
				console.log("index", that.state.sliderIndex);
			}

			function moveDriver() {
				// when checkbox in toggleStartCheckbox cancel here
				if(that.state.cancelSlide) {
					console.log("CANCEL");
					return;
				}
				// if zero cannot movebackwards
				console.log("state", that.state.finalSliderCoords);
				if(!that.state.slideIndex) {
					//    console.log('index', that.state.sliderIndex)
					console.log("state", that.state.finalSliderCoords);
					// console.log(that.state.finalSliderCoords[that.state.sliderIndex])
					if(
						!that.state.finalSliderCoords[that.state.sliderIndex] &&
						!that.state.finalSliderCoords[that.state.sliderIndex]
					) {
						console.error("Cannot move backwards past beginning of graph.");
						return;
					}
				}

				that.updateDriverWithCoords({
						x: that.state.finalSliderCoords[that.state.sliderIndex].x,
						y: that.state.finalSliderCoords[that.state.sliderIndex].y
					},
					"slider"
				);
			}
			var i = 0;
			looper(i);
			// move driver x times with delay
			function looper() {
				setTimeout(function() {
					if(sliderDiff() >= 0) {
						if(i < sliderDiff()) {
							handleIndexValue();
							moveDriver();
							looper();
						}
						i = i + 1;
					} else if(sliderDiff() < 0) {
						if(i > sliderDiff()) {
							handleIndexValue();
							moveDriver();
							looper();
						}
						i = i - 1;
					}
				}, 10);
			}

			// }
			sliderDiff();
		}
	}

	toggleSnackbar() {
		this.setState({
			snackbarOpen: utils._toggleState(this.state.snackbarOpen)
		});
	}
	// https://stackoverflow.com/questions/16863917/check-if-class-exists-somewhere-in-parent-vanilla-js/19049101
	hasParentClass(element, checkClass) {
		if(element.className.split(" ").indexOf(checkClass) >= 0) return true;
		return (
			element.parentElement &&
			this.hasParentClass(element.parentElement, checkClass)
		);
	}
	// https://stackoverflow.com/a/47580775/5972531
	toggleShowCursor(e) {
		let currentCursor = this.state.cursorArr[this.state.cursorIndex];
		currentCursor.show = !currentCursor.show;
		const cursorArrCopy = [...this.state.cursorArr];
		this.setState({
			cursorArr: cursorArrCopy
		});
	}
	handleClick(event) {
		if(!event) return;
		// For TAB clicks - sending strings back here as return vals
		// to remove drivers from tabs when clicking X
		if(event.event && event.iconClick && event.cursor) {
			// don't remove single driver
			if(this.state.cursorArr.length > 1) {
				this.removeDriver(event);
			}
			// to detect which driver is selected
		} else if(event.event && !event.iconClick && event.cursor) {
			// use data prop on html
			let tabClickedIndex = parseInt(event.event.target.dataset.key);
			// change to another cursor based on click
			this.changeCursor("change-cursor", tabClickedIndex);
			let that = this;
			setTimeout(function() {
				that.toggleShowCursor(event);
			});
			// if events and not strings
		} else if(event.target.classList.contains("add-button")) {
			event.stopPropagation();
			// call add new driver
			this.addNewCursor();
		} else if(event.target.classList.contains("secondary-button")) {
			event.stopPropagation();
			if(event.target.dataset.number === "1") {
				this.colorAllStops();
				this.setState({
					allColorsCounter: this.state.allColorsCounter + 1,
					colorType: "all"
				});
			} else if(event.target.dataset.number === "2") {
				this.colorCompletedStops();
				this.setState({
					completedColorsCounter: this.state.completedColorsCounter + 1,
					colorType: "complete"
				});
			}
			// if button and has parent class of snackbar
		} else if(
			event.target.type === "button" &&
			this.hasParentClass(event.target, "snackbar")
		) {
			// send this to child to close
			this.setState({
				snackbarOpen: false
			});
			// for show modal button
		} else if(
			event.target.dataset.number === "4" &&
			event.target.classList.contains("button")
		) {
			this.setState({
				modalState: utils._toggleState(this.state.modalState)
			});
		}
	}
	onDropdownSubmit(event) {
		let selectedCursor = this.state.cursorArr[this.state.cursorIndex];
		event.preventDefault();
		if(event.target.name === "driver-dropdown") {
			// user needs to choose a leg else return
			if(!this.state.cursorLegInput) return;
			let progress;
			if(!this.state.cursorInputProgress) {
				progress = 0;
			} else {
				progress = this.state.cursorInputProgress;
			}
			let updatedData = {
				activeLegID: this.state.cursorLegInput,
				legProgress: progress
			};
			selectedCursor.data = updatedData;
			//update driver position in state
			this.setState({
				cursorArr: this.state.cursorArr
			});
			let that = this;
			setTimeout(function() {
				that.updateCursorwithData(selectedCursor.data);
				that.colorCompleted(selectedCursor.data.activeLegID);
			}, 100);
		} else if(event.target.name === "color") {
			this.colorLeg(this.state.legToColorID);
		}
	}
	// hold vals in input until next entered
	handleChange(evt) {
		// to filter out undefined errors
		if(
			evt.target.name === "x" &&
			evt.currentTarget.parentNode.parentNode.parentNode.classList.contains(
				"graph-size"
			)
		) {
			let xVal = evt.target.value;
			// onChange store the input sizes
			this.setState(prevState => ({
				storeGraphSize: {
					...prevState.storeGraphSize,
					x: xVal
				}
			}));
		} else if(
			evt.target.name === "y" &&
			evt.currentTarget.parentNode.parentNode.parentNode.classList.contains(
				"graph-size"
			)
		) {
			let yVal = evt.target.value;
			this.setState(prevState => ({
				storeGraphSize: {
					...prevState.storeGraphSize,
					y: yVal
				}
			}));
		} else if(
			evt.target.name === "x" &&
			!evt.currentTarget.parentNode.parentNode.parentNode.classList.contains(
				"graph-size"
			)
		) {
			this.setState({
				cursorFormX: evt.target.value
			});
		} else if(
			evt.target.name === "y" &&
			!evt.currentTarget.parentNode.parentNode.parentNode.classList.contains(
				"graph-size"
			)
		) {
			this.setState({
				cursorFormY: evt.target.value
			});
		} else if(evt.target.name === "driver-select") {
			this.setState({ cursorLegInput: evt.target.value });
		} else if(evt.target.name === "progress-input") {
			this.setState({ cursorInputProgress: evt.target.value });
			// comes from names on checkboxes
		} else if(evt.target.name === "float-toggle") {
			// go to bottom on toggle
			let offSet = this.getWindowOffset();
			if(offSet) {
				this.setState({
					utilsTop: offSet,
					floatToggle: utils._toggleState(this.state.floatToggle)
				});
			}
		} else if(evt.target.name === "stop-name-toggle") {
			this.setState({
				showStopNames: utils._toggleState(this.state.showStopNames)
			});
		} else if(evt.target.name === "color-select") {
			this.setState({
				value: evt.target.value,
				legToColorID: evt.target.value
			});
		} else if(evt.target.name === "icon-start") {
			this.toggleStartCheckbox();
			// plot points from modal input
		} else if(
			evt.target.name === "xSelect" ||
			evt.target.name === "ySelect" ||
			(evt.target.classList && evt.target.classList.contains("close-icon")) ||
			(evt.target.nextSibling &&
				evt.target.nextSibling.classList.contains("modal"))
		) {
			if(evt.target.name === "xSelect") {
				this.setState(prevState => ({
					tempPlotObj: {
						...prevState.tempPlotObj,
						x: evt.target.value
					}
				}));
				let that = this;
				setTimeout(function() {
					that.receivePlotData(that.state.tempPlotObj);
				});
			} else if(evt.target.name === "ySelect") {
				this.setState(prevState => ({
					tempPlotObj: {
						...prevState.tempPlotObj,
						y: evt.target.value
					}
				}));
				let that = this;
				setTimeout(function() {
					that.receivePlotData(that.state.tempPlotObj);
				});
				// when X is clicked trigger this - open close
			} else if(evt.target.classList.contains("close-icon")) {
				this.handleModalOpenClose();
				// on modal close trigger this - open close
			} else if(evt.target.nextSibling.classList.contains("modal")) {
				this.handleModalOpenClose();
			}
		}
	}
	// set plot points from inputs in modal
	receivePlotData(obj) {
		console.log(obj);
		if(!obj.x || !obj.y) {
			console.error("Must have two plot points");
			return false;
		}
		this.setState({
			tempPlotObj: obj,
			plotObjs: [...this.state.plotObjs, this.state.tempPlotObj]
		});
	}
	toggleStartCheckbox() {
		let setSliderCoords;
		let tempSliderIndex;
		let sliderChunkCopy;
		// if not at first stop, include all coords in slider
		console.log(this.state.sliderSlicedChunk);
		if(this.state.iconStartAtfirstStop) {
			// slice off part before start
			sliderChunkCopy = this.state.sliderCoordsArrs.splice(0, 1);
			// reassign arr without that part
			setSliderCoords = this.state.sliderCoordsArrs;
			// console.log("S" ,setSliderCoords)
			tempSliderIndex = 10;
			this.updateDriverWithCoords({
					x: this.state.stops[0].x,
					y: this.state.stops[0].y
				},
				"checkbox"
			);
		} else {
			// if at first stop, only allow slider from there
			setSliderCoords = this.state.sliderSlicedChunk.concat(
				this.state.sliderCoordsArrs
			);
			console.log("slider", this.state.sliderCoordsArrs);
			tempSliderIndex = 0;
			this.updateDriverWithCoords({
					x: 0,
					y: 0
				},
				"checkbox"
			);
		}
		this.setState({
			sliderSlicedChunk: sliderChunkCopy ?
				sliderChunkCopy :
				this.state.sliderSlicedChunk,
			cancelSlide: true,
			iconStartAtfirstStop: utils._toggleState(this.state.iconStartAtfirstStop),
			sliderCoordsArrs: setSliderCoords,
			sliderIndex: tempSliderIndex,
			// flatten array to remove/add coords when clicked
			finalSliderCoords: setSliderCoords.flat()
		});
	}
	// add the beginning to the stops
	addStartStop() {
		// make an array including beginning
		let stops = [{
			name: "A",
			x: 0,
			y: 0
		}];
		let arr = stops.concat(this.state.stopsCopy);
		this.setState({
			stopsCopy: arr
		});
	}
	// scroll page to the bottom
	scrollToBottom() {
		window.scrollTo(0, document.body.scrollHeight);
	}
	getWindowOffset() {
		let utils = document.querySelector(".utils-container");
		let grid = document.querySelector(".grid-container");

		if(utils.offsetHeight + grid.offsetHeight > window.innerHeight) {
			return utils.offsetHeight;
		} else {
			return false;
		}
	}
	componentDidMount() {
		let that = this;
		// create graph size based on input - COMMENT OUT
		this.createGraph();
		this.scrollToBottom();
		let utils = document.querySelector(".utils-container");
		setTimeout(function() {
			that.setState({
				utilsTop: utils.offsetHeight
			});
		}, 500);

		setTimeout(function() {
			// console.log(that.state.legs)
			//--- COMMENT OUT
			// that.state.stops.map((stop, i) => {
			//         that.legStartEnd(stop.x, stop.y,'all')
			//         that.colorGrid(stop.x, stop.y, 'all')
			//
			// })
			// call these with the default driver on mount
			//--- COMMENT OUT
			that.addNewCursor();
			that.updateDriverWithCoords({ x: 0, y: 0 }, "manual");
			// that.updateCursorwithData(that.state.loadingDataArr[0])
			// that.colorCompleted(that.state.loadingDataArr[0].activeLegID, "coords")

			// that.pleted(that.state.driverCoords.y)
			// console.log('state',that.state)
		}, 100);

		// make array of coords to move icon
		setTimeout(function() {
			// start at first stop
			// that.updateDriverWithCoords({
			//     x: 0,
			//     y: 0,
			// }, "checkbox")
			//--- COMMENT OUT
			// start from map beginng
			// that.addStartStop()
			// make slider coords
			//--- COMMENT OUT
			//     that.state.stopsCopy.map((stop, index) => {
			//         if(!that.state.stopsCopy[index + 1]) return
			//         let { xSlideCoord, ySlideCoord } = that.slideRange(stop, that.state.stopsCopy[index + 1])
			//         console.log(xSlideCoord, ySlideCoord)
			//         that.sliderCoordsCalc(xSlideCoord, ySlideCoord, "stop-coords")
			//     })
		}, 500);
	}

	// takes two ranges and combines the arrays
	// calcs where smaller axis points coords should be placed with larger
	// makes arr of arrs of all slider coords to follow
	sliderCoordsCalc(xSlideCoord, ySlideCoord, type) {
		let storeArr = [];
		let currentSmall;
		let previousSmall;
		// console.log('COORDS', xSlideCoord, ySlideCoord)

		let xArr = xSlideCoord;
		let yArr = ySlideCoord;

		// console.log(xArr)
		// console.log(yArr)
		let longerArr;
		let shorterArr;
		if(xArr.length >= yArr.length) {
			longerArr = xArr;
			shorterArr = yArr;
		} else {
			longerArr = yArr;
			shorterArr = xArr;
		}
		// store last values of arrs
		let lastXarr = xArr[xArr.length - 1];
		let lastYarr = yArr[yArr.length - 1];
		if(xArr.length) {
			this.setState({ lastXarr });
		}
		if(yArr.length) {
			this.setState({ lastYarr });
		}
		// console.log('short',shorterArr)
		// console.log('long',longerArr)
		let obj;
		// j runs on all small loop
		let j = 0;

		for(var i = 0; i < longerArr.length; i++) {
			// Vals to use while function runs
			// if there and not equal to last, reassign
			if(shorterArr[i] && shorterArr[i] !== currentSmall) {
				currentSmall = shorterArr[i];
			} else {
				// if not there, use the value in state
				if(!currentSmall) {
					previousSmall = this.state.previousSmall;
				} else {
					// if there but the same, use the one stored in current and save to state
					previousSmall = currentSmall;
					this.setState({ previousSmall: previousSmall });
				}
			}
			if(j < shorterArr.length) {
				// loop through both until shorter runs out
				obj = {
					[Object.keys(longerArr[i])[0]]: Object.values(longerArr[i])[0],
					[Object.keys(shorterArr[i])[0]]: Object.values(shorterArr[i])[0]
				};
				// increase inner loop
				j++;
			} else {
				// inside loop already use val stored within the function
				if(i > 0) {
					obj = {
						[Object.keys(longerArr[i])[0]]: Object.values(longerArr[i])[0],
						[Object.keys(previousSmall)[0]]: Object.values(previousSmall)[0]
					};
					// begginning of loop - get value from state and set it on first loop run
				} else {
					// if long x, get last y
					if(Object.keys(longerArr[i])[0] === "x") {
						previousSmall = this.state.lastYarr;
						this.setState({ previousSmall });
					} else {
						// if long y, get last x
						previousSmall = this.state.lastXarr;
						this.setState({ previousSmall });
					}
					// console.log('first Run', this.state.previousSmall)
					obj = {
						[Object.keys(longerArr[i])[0]]: Object.values(longerArr[i])[0],
						[Object.keys(previousSmall)[0]]: Object.values(previousSmall)[0]
					};
				}
			}
			storeArr.push(obj);

			// console.log(' obj', obj)
		}
		// console.log('stops1',this.state.stopsCopy[0])
		// console.log('stops2',this.state.stopsCopy[1])
		// console.log('store',storeArr)

		this.setState({
			sliderCoordsArrs: [...this.state.sliderCoordsArrs, storeArr]
		});
	}

	// creates two rangeArr each x/y  start - stop
	// this sets state for sliderCalcs
	slideRange(startObj, endObj) {
		if(!startObj || !endObj) return;
		// console.log(startObj)
		let yArr = [];
		let xArr = [];
		let x1 = startObj.x;
		let y1 = startObj.y;
		let { xToMove, yToMove } = this._numBetweenStops(startObj, endObj);
		// console.log("x", xToMove)
		// console.log("y", yToMove)
		// find if pos of neg
		let xIsInteger = xToMove < 0 ? false : true;
		let yIsInteger = yToMove < 0 ? false : true;
		// make arr of x/y stops
		for(var i = 0; i < Math.abs(yToMove); i++) {
			if(yIsInteger) {
				let obj = { y: y1 + (i + 1) };
				yArr.push(obj);
			} else {
				let obj = { y: y1 - (i + 1) };
				yArr.push(obj);
			}
		}
		for(var j = 0; j < Math.abs(xToMove); j++) {
			if(xIsInteger) {
				let obj = { x: x1 + (j + 1) };
				xArr.push(obj);
			} else {
				let obj = { x: y1 - (j + 1) };
				xArr.push(obj);
			}
		}
		// console.log(xArr)
		// console.log(yArr)
		// push to state
		return {
			xSlideCoord: xArr,
			ySlideCoord: yArr
		};
	}
	_numBetweenStops(stop1, stop2) {
		let x1 = stop1.x;
		let x2 = stop2.x;
		let y1 = stop1.y;
		let y2 = stop2.y;
		// console.log(y1)
		// console.log(y2)
		let xToMove;
		let yToMove;
		if(x1 > x2) {
			xToMove = x1 - x2;
			xToMove = -Math.abs(xToMove);
		} else {
			xToMove = x2 - x1;
		}

		if(y1 > y2) {
			yToMove = y1 - y2;
			yToMove = -Math.abs(yToMove);
		} else {
			yToMove = y2 - y1;
		}
		return { xToMove, yToMove };
	}
	handleSubmit(event) {
		event.preventDefault();
		let that = this;

		function validGraphSides(input) {
			if(input.x !== input.y) {
				console.error("X and Y must be equal");
				alert("X and Y values must be equal");
				return false;
			}
			return true;
		}
		// on submit use the stored sizes
		if(event.target.name === "graph-size") {
			if(!validGraphSides(this.state.storeGraphSize)) return;
			this.setState({
				setGraphSize: this.state.storeGraphSize
			});
			setTimeout(function() {
				console.log(that.state.setGraphSize);
				that.createGraph();
				return;
			}, 100);
		}
		let currentCursor = this.state.cursorArr[this.state.cursorIndex];
		// update coords
		//set driver to those
		//UPDATE STATE DATA
		if(
			event.target.name === "driver-dropdown" ||
			event.target.name === "color"
		) {
			this.onDropdownSubmit(event);
		} else if(event.target.name === "driver-form") {
			let formData = {};
			// set to new input. If blank use the previous one
			if(this.state.cursorFormX) {
				formData["x"] = parseInt(this.state.cursorFormX);
			} else {
				formData["x"] = currentCursor.driverCoords.x;
			}
			if(this.state.cursorFormY) {
				formData["y"] = parseInt(this.state.cursorFormY);
			} else {
				formData["y"] = currentCursor.driverCoords.y;
			}
			currentCursor.driverCoords = formData;
			//ACTUALLY MOVE CURSOR
			this.updateDriverWithCoords("", "form");
			let that = this;
			setTimeout(function() {
				//UPDATE DRIVER DATA
				// returns false if not a stop
				let result = that.updateDriverData();
				if(!result) {
					// not part of route
					that.toggleSnackbar();
					return;
				}
				that.colorCompleted(that.state.selectedDriver.activeLegID);
			}, 100);
		} else if(
			event.target.classList &&
			event.target.classList.contains("modal-submit")
		) {
			this.handlePlotLoading("manual");
		} else if(
			event.target.classList &&
			event.target.classList.contains("auto-plot-submit")
		) {
			this.handlePlotLoading("auto");
		}
	}
	handlePlotLoading(type) {
		let that = this;
		if(type === "manual") {
			let json = utils._makePlotJson(this.state.plotObjs);
			this.setState({ stops: json });
			this._setStopCoords("stop");
			setTimeout(function() {
				that.legConstructor(that.state.stops);
				that.state.stops.forEach((stop, i) => {
					that.legStartEnd(stop.x, stop.y, "all");
					that.colorGrid(stop.x, stop.y, "all");
				});
			});
		} else if(type === "auto") {
			this._callStops().then(res => {
				this.setState({
					stops: res.stops,
					stopsCopy: res.stops,
					// set auto 100
					setGraphSize: { x: "100", y: "100" },
					plotObjs: res.stops
				});
				this.createGraph();
				this._setStopCoords("stop");
				setTimeout(function() {
					that.legConstructor(that.state.stops);
					that.state.stops.forEach((stop, i) => {
						that.legStartEnd(stop.x, stop.y, "all");
						that.colorGrid(stop.x, stop.y, "all");
					});
				});
			});
		}
	}
	_legIndex(input) {
		let index;
		switch (input) {
			// pre-stop
			case "ZZ":
				index = 0;
				break;
			case "AB":
				index = 1;
				break;
			case "BC":
				index = 2;
				break;
			case "CD":
				index = 3;
				break;
			case "DE":
				index = 4;
				break;
			case "EF":
				index = 5;
				break;
			case "FG":
				index = 6;
				break;
			case "GH":
				index = 7;
				break;
			case "HI":
				index = 8;
				break;
			case "IJ":
				index = 9;
				break;
			case "JK":
				index = 10;
				break;
			case "KL":
				index = 11;
				break;
			default:
				console.error("Nothing in switch");
				break;
		}
		return index;
	}
	colorLeg(input) {
		// - get val from Dropdown-
		// change it to an index
		let index = this._legIndex(input);
		// get leg using index out of array
		let leg = this.state.holdAllLegColorArrs[index];
		// set state on child to change the color
		let legObj = { leg, index };
		this.setState({
			finalLegColorObj: legObj,
			legColorsCounter: this.state.legColorsCounter + 1,
			colorType: "leg"
		});
	}
	// build legs out of stops
	legConstructor(stops) {
		let legs = stops
			.map((stop, i) => {
				if(!stops[i + 1]) return false;
				return {
					startStop: stop.name,
					endStop: stops[i + 1].name,
					legID: `${stop.name}${stops[i + 1].name}`
				};
			})
			.filter(stop => stop);
		this.setState({
			legs: legs
		});
		return;
	}
	// set coords in pxs of plots
	_setStopCoords(type, x, y) {
		let that = this;
		let coordsArr = [];
		// filter out undefined
		if(type === "stop") {
			setTimeout(function() {
				if(that.state.stops.length > 0) {
					that.state.stops.forEach(stop => {
						let pixels = utils._convertToPixels(stop.x, stop.y);
						let coords = {
							pixels: pixels,
							directions: {
								xDir: "left",
								yDir: "bottom"
							}
						};
						coordsArr.push(coords);
					});
				}
				that.setState({
					stopsDirsArr: coordsArr
				});
			}, 1050);
		} else if(type === "driver") {
			let pixels = utils._convertToPixels(x, y);
			let coords = {
				pixels: pixels,
				directions: {
					xDir: "left",
					yDir: "bottom"
				}
			};
			return coords;
		}
	}
	_callStops = async () => {
		const response = await fetch("/stops");
		const body = await response.json();

		if(response.status !== 200) {
			throw Error(body.message);
		}
		return body;
	};
}

export default Grid;
