console.log("partial");
   // start of leg
   tempCellNum = this.state.startingCellNumPartial;
   console.log("staring cell", this.state.startingCellNumPartial);
   // set to start coords - it should compute to end coord form here
   console.log("leg end x", this.state.partialLegEndCoords.x);
   console.log("leg end y", this.state.partialLegEndCoords.y);
   this.setState({
     previousStopX: this.state.partialLegStartCoords.x,
     previousStopY: this.state.partialLegStartCoords.y
   });
   // console.log(this.state.previousStopX)
   // console.log(this.state.previousStopY)
   // console.log('previous',this.state.partialLegStartCoords)
   // console.log('previousx', this.state.previousStopX)
   // console.log('previousy', this.state.previousStopY)
   // console.log('currentx ', x)
   // console.log('currenty', y)
 }
 // console.log(tempX)
 // convert based on next move using above function
 tempX = this._numToMove(tempX, tempY, "stop").tempX;
 tempY = this._numToMove(tempX, tempY, "stop").tempY;
 // tempY = this._numToMove(tempX, tempY, 'stop').moveY
 // console.log('tempx', tempX)
 // console.log('tempy', tempY)

 // on first move on grid only - for bottom corner
 if (this.state.previousStopX === 0 && this.state.previousStopY === 0) {
   tempX = tempX - 1;
   tempY = tempY - 1;
   tempCellNumsArr.push(tempCellNum);
 }
