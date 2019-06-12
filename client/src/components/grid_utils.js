var utils = (function() {
  return {
    _convertToPixels: function(x, y) {
      if (!x) {
        x = 0
      }
      if (!y) {
        y = 0
      }
      let totalX
      let totalY
      if (x) {
        x = x - 10
        totalX = 100 + x * 11
      } else {
        totalX = x * 10
      }
      if (y) {
        y = y - 10
        totalY = 100 + y * 11
      } else {
        totalY = y * 10
      }
      let moveX = parseInt(totalX)
      let moveY = parseInt(totalY)
      let coordsObj = {
        moveX: moveX,
        moveY: moveY
      }
      return coordsObj
    },
    _numToMove: function(x, y, type) {
      if (type === 'stop') {
        let moveX = Math.abs(this.state.previousStopX - x)
        let moveY = Math.abs(this.state.previousStopY - y)
        return {
          tempX: moveX,
          tempY: moveY
        }
      } else if (type === 'leg') {
        let moveX = Math.abs(this.state.previousLegX - x)
        let moveY = Math.abs(this.state.previousLegY - y)
        return {
          tempX: moveX,
          tempY: moveY
        }
      } else {
        console.error('error in the num to move function')
      }
    },
    _calcStartingCell: function(sizeObj) {
      // find the corner cell formula is (x * y) - x
      let startingCellNum =
        parseInt(sizeObj.x) * parseInt(sizeObj.y) - parseInt(sizeObj.x)
      return startingCellNum
    },
    // takes 2 objs of coords and determines the diff
    _absDiff: function(firstCoordsObj, secondCoordsObj) {
      let xDiff = Math.abs(firstCoordsObj.x - secondCoordsObj.x)
      let yDiff = Math.abs(firstCoordsObj.y - secondCoordsObj.y)
      return {
        xDiff,
        yDiff
      }
    },
    _getDriverCoords: function(firstLegStopObj, lastLegStopObj, numToMoveObj) {
      let x1 = firstLegStopObj.x
      let x2 = lastLegStopObj.x
      let y1 = firstLegStopObj.y
      let y2 = lastLegStopObj.y
      let xNum = numToMoveObj.xNum
      let yNum = numToMoveObj.yNum
      // if x moves up, add
      let xToMove
      let yToMove
      if (x1 < x2) {
        xToMove = x1 + xNum
      } else if (x1 >= x2) {
        xToMove = x1 - xNum
      } else {
        console.error('error in driver movement')
      }
      if (y1 < y2) {
        yToMove = y1 + yNum
      } else if (y1 >= y2) {
        yToMove = y1 - yNum
      } else {
        console.error('error in driver movement')
      }
      return {
        x: xToMove,
        y: yToMove
      }
    },
    // take amount in leg with a percent - returns num to move out of total leg number
    _percentToCoords: function(diffObj, percent) {
      let xNum = Math.floor(diffObj.xDiff * 0.01 * percent)
      let yNum = Math.floor(diffObj.yDiff * 0.01 * percent)
      return { xNum, yNum }
    },
    // takes first stop obj, driver coords obj, and abs diff of a single stops axis
    _findPercentFromDriverCoords(firstStop, driverCoords, yAbsDiff, xAbsDiff) {
      let x1 = parseInt(firstStop.x)
      let y1 = parseInt(firstStop.y)
      let x2 = parseInt(driverCoords.x)
      let y2 = parseInt(driverCoords.y)

      let xDiff
      let yDiff

      // find number moved from last stop
      if (x1 < x2) {
        xDiff = x2 - x1
      } else if (x1 > x2) {
        xDiff = x1 - x2
      } else if (x1 === x2) {
        xDiff = 0
      } else {
        console.error('error in driver movement')
      }
      if (y1 < y2) {
        yDiff = y2 - y1
      } else if (y1 > y2) {
        yDiff = y1 - y2
      } else if (y1 === y2) {
        yDiff = 0
      } else {
        console.error('error in driver movement')
      }

      // divide number moved so far in leg by total number in leg
      let xPercent
      let yPercent
      // check for zero vals
      if (xDiff === 0) {
        xPercent = 0
      }
      if (yDiff === 0) {
        yPercent = 0
      }
      if (xDiff && xDiff !== 0) {
        xPercent = xDiff / xAbsDiff
      }
      if (yDiff && yDiff !== 0) {
        yPercent = yDiff / yAbsDiff
      }
      // let finalPercent

      // if one val is missing use the other alone
      if (!xPercent || !yPercent) {
        if (xPercent) {
          return xPercent * 100
        } else if (yPercent) {
          return yPercent * 100
        }
      }
      // it both are zero then zero percent
      if (xPercent === 0 && yPercent === 0) {
        return 0
      }

      //use the larger leg to updaet val - TODO: make both percents equal so driver fits back into grid
      if (xAbsDiff > yAbsDiff) {
        return xPercent
      } else if (xAbsDiff < yAbsDiff) {
        return yPercent
        // if equal use the larger percent
      } else if (xAbsDiff === yAbsDiff) {
        if (xPercent >= yPercent) {
          return xPercent
        } else {
          return yPercent
        }
      } else {
        console.error('An error occured in the percentage calcs')
        return
      }
    },
    // make json from the entered plot points
    _makePlotJson(plotsArr) {
      return plotsArr.map((coords, i) => {
        return {
          name: String.fromCharCode(i + 65),
          x: coords.x,
          y: coords.y
        }
      })
    },
    _toggleState(currentState) {
      if (!currentState) {
        return true
      } else {
        return false
      }
    },
    _Cell(cellNum, color) {
      this.cellNum = cellNum
      this.color = color
    },
    _makePLotCellObj(cellNum, color, cellFunc) {
      return new cellFunc(cellNum, color)
    },
    _arrOfObjsToArr(arrOfObjs, property) {
      return arrOfObjs.map(obj => {
        return obj[property]
      })
    }
  }
})()

export default utils
