import React from 'react'

// takes and array of directions and pixes for x and y
function Truck(props){
    if(!props.coords) return null
    let coord = props.coords
    // console.log(props)
    let driverID = props.coords.id
    // console.log(driverID)
    let style = {
        [coord.directions.xDir]: coord.pixels.moveX.toString() + 'px',
        [coord.directions.yDir]: coord.pixels.moveY.toString() + 'px',
        "--driver-color": props.colors[driverID]
    }
    return(
        <div className="truck" style={style}></div>
    )
}

export default Truck
