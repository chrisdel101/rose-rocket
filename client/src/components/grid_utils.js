var utils = (function () {
    return {
    _convertToPixels: function(x,y) {
        if(!x){
            x = 0
        }
        if(!y){
            y =0
        }
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
    },
    _numToMove: function(x,y, type){
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

    },
    _calcStartingCell: function(sizeObj){
        // find the corner cell formula is (x * y) - x
            let startingCellNum = (parseInt(sizeObj.x) * parseInt(sizeObj.y)) - parseInt(sizeObj.x)
            console.log('startingCell', startingCellNum)
            return startingCellNum
    },
    // takes 2 objs of coords and determines the diff
    _absDiff: function(firstCoordsObj, secondCoordsObj){
        let xDiff = Math.abs(firstCoordsObj.x - secondCoordsObj.x)
        let yDiff = Math.abs(firstCoordsObj.y - secondCoordsObj.y)
        return {
            xDiff,
            yDiff
        }
    },
    _getDriverCoords: function(firstLegStopObj, lastLegStopObj, numToMoveObj ){
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
    },
    // take amount in leg with a percent - returns num to move out of total leg number
    _percentToCoords: function(diffObj, percent){
        let xNum = Math.floor((diffObj.xDiff * 0.01) * percent)
        let yNum = Math.floor((diffObj.yDiff * 0.01) * percent)
        return {xNum, yNum}
    },
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
    },
    // make json from the entered plot points
    _makePlotJson(plotsArr){
        return plotsArr.map((coords,i) => {
            return {
                    "name":String.fromCharCode(i+65),
                    "x":coords.x,
                    "y":coords.y
                }
            })
        }


}
})();

export default utils
