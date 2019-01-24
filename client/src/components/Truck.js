import React from 'react'

// takes and array of directions and pixes for x and y
function Truck(props){
    if(!props.coords) return null
    console.log('props', props)
    let coord = props.coords
    let style = {
        [coord.directions.xDir]: coord.pixels.moveX.toString() + 'px',
        [coord.directions.yDir]: coord.pixels.moveY.toString() + 'px'
    }

    return(
        <div className="truck" style={style}></div>
    )
}

export default Truck
