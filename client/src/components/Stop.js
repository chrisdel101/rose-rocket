import React from 'react'

function Stop(props){
    console.log('props', props)
    // function pixelsToMove(props){
    //     console.log('props', props)
    //     if(!props){
    //         return
    //     }
    // // call on each set
    function getCoords(x, y, width, height){

        directionToMove(x, y)

        let moveX = parseInt(x) * width
        let moveY = parseInt(y) * height
        console.log(moveX)
        console.log(moveY)
        // let that = this
        // console.log(this)

        setTimeout(function(){
            that.setState({
                stopCoords:{
                    [this.state.xDir]: moveX,
                    [this.state.yDir]: moveY
                }
            })

        },500)
    }

    directionToMove(x,y){
        let xDir
        let yDir
        // check if up or down / + -
        if(x < 0){
            xDir = "left"
        } else {
            xDir = "right"
        }
        if(y < 0){
            yDir = "top"
        } else {
            yDir = "bottom"
        }
        this.setState({
            xDir: xDir,
            yDir: yDir
        })
    }
        let x = props.move.xDir
        let y = props.move.yDir
        let xCoord = props.move.stopCoords.xDir
        let yCoord = props.move.stopCoords.yDir
        let obj = {
            [x]: xCoord,
            [y]: yCoord
            // props.move.yDir: props.move
        // }
        // return obj
    }
    return(
        <div className="stop-marker" style={obj}></div>
    )
}

export default Stop
