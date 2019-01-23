class Box extends React.Component{
    constructor(props) {
		super(props)
        this.state = {

        }
	}

  renderBoxes(i){
  console.log(this.props)
        if(this.props.toRender){
            let {toRender, toAdd} = this.props;
            return(
									toRender.map((obj, i) => {
                      let hasColor = (()=>{
												if (!toAdd || !toAdd.length || !toAdd.includes(i)) return false;
                        return true;
											})();
                      return (
                          <div
                            className={`box ${( hasColor ? " background-color" : "")}`}
                            key={i}
                          ></div>
                      );
                  })
            )
        }
    }
   render(){
   	if (this.props.toRender && this.props.toRender.length) {
     return(
          <React.Fragment>
              {this.renderBoxes()}
          </React.Fragment>
      )
     } else {
      return (
        <div>
          No Boxes yet!
        </div>
			)
		}
    }
 }
class Grid extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
    previousX: 0,
    previousY: 0,
    startingCellNum:5000,
    	boxesToRender: Array.from({length: 40000}, (v, i) => i),
      classesToAdd:[],
      holdingAllIndexes: []
    }
  }

	colorGrid(x, y){
        let that = this
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


        // convert based on next move
        tempX = _numToMove().moveX
        tempY = _numToMove().moveY

        // color current cell - on first move on grid only
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
         // axis - loop over the only one left
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
        console.log(this.state.holdingAllIndexes)
        this.
                //console.log(tempCellNum)

        this.setState({
            previousX: x,
            previousY: y,
            startingCellNum: tempCellNum,
            holdingAllIndexes: [...this.state.holdingAllIndexes, ...tempCellNumsArr]
        })
    }
    testColor(){
        let stops = [
            {x:20, y:10},
            {x: 20, y: 20},
            {x: 25, y: 30},
            {x: 25, y: 80}
        ]
        stops.map((stop, index) => {
                let that = this
                setTimeout(function(){
                    return that.colorGrid(stop.x, stop.y)

                },100*(index))
            })
            /* if(index + 1 === stops.length){

            } */
    }

  render() {
    return (
      <div className="grid-container">
             <div className="utils-container">
                        <button onClick={this.testColor.bind(this)}>Add Class</button>
              </div>
                <div className="grid">

                    <Box toRender={this.state.boxesToRender} toAdd={(this.state.cellNumsArr ? this.state.cellNumsArr  : null)}/>
                </div>


        </div>
    )

	}
}

ReactDOM.render(<Grid />, document.querySelector("#app"))
