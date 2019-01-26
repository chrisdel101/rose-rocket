import React from 'react'
import { Manager, Reference, Popper } from 'react-popper';


// takes and array of directions and pixes for x and y
function Stop(props){
    if(!props.coords) return null
    // console.log('props', props)
    let coordsArr = props.coords
    return coordsArr.map((coord, i) => {
        let styles = {
            [coord.directions.xDir]: coord.pixels.moveX.toString() + 'px',
            [coord.directions.yDir]: coord.pixels.moveY.toString() + 'px'
        }
        // console.log('styles', styles)
        return(
            <Manager key={i}>
            <Reference>
            {({ ref }) => (
                <div className="stop-marker" style={styles}></div>
            )}
            </Reference>
            <Popper placement="right">
            {({ ref, style, placement, arrowProps }) => (
                <div ref={ref} style={style} data-placement={placement}>
                Popper element
                <div ref={arrowProps.ref} style={arrowProps.style} />
                </div>
            )}
            </Popper>
            </Manager>
        )
    })
}

export default Stop
