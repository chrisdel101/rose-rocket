import React from 'react'

// takes and array of directions and pixes for x and y
function Stop(props){
    if(!props.coords) return null
    console.log('props', props)
    let coordsArr = props.coords
    return coordsArr.map((coord, i) => {
        let styles = {
            [coord.directions.xDir]: coord.pixels.moveX.toString() + 'px',
            [coord.directions.yDir]: coord.pixels.moveY.toString() + 'px'
        }
        console.log('styles', styles)
        return(
            <div className="stop-marker" style={{right: "5px", bottom: "0px"}} key={i}></div>
        )
    })
}

export default Stop
