import React from 'react'

function Stop(props){
    console.log('props', props)
    // function pixelsToMove(props){
    //     console.log('props', props)
    //     if(!props){
    //         return
    //     }
    // // call on each set

    // old way of handling props
        // let x = props.move.xDir
        // let y = props.move.yDir
        // let xCoord = props.move.stopCoords.xDir
        // let yCoord = props.move.stopCoords.yDir
        // let obj = {
        //     [x]: xCoord,
        //     [y]: yCoord
        //     // props.move.yDir: props.move
        // }
        // return obj

    return(
        <div className="stop-marker" style={''}></div>
    )
}

export default Stop
