import React from 'react'
import { Manager, Reference, Popper } from 'react-popper';
import Icon from './material/Icon'

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
        return(
            <Manager key={i}>
        <Reference>
          {({ ref }) => (

              <Icon
                str="place"
                stop={true}
                refs={ref}
                styles={styles}
                />
          )}
        </Reference>
        <Popper placement="left">
          {({ ref, style, placement, arrowProps }) => (
            <div
              ref={ref}
              style={{ ...style, backgroundColor: "#F0FFFF", marginLeft: "0px" }}
              data-placement={placement}
            >
              {`stop${String.fromCharCode(65 + i)}`}
              <div ref={arrowProps.ref} style={arrowProps.style} />
            </div>
          )}
        </Popper>
      </Manager>
        )
    })
}

export default Stop
