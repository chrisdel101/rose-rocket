import React from 'react'
import { Manager, Reference, Popper } from 'react-popper'

// takes and array of directions and pixes for x and y
function Stop(props) {
  if (!props.coordsArrs) return null
  console.log(props)
  return props.coordsArrs.map((coord, i) => {
    let styles = {
      color: props.color,
      [coord.directions.xDir]: coord.pixels.moveX.toString() + 'px',
      [coord.directions.yDir]: coord.pixels.moveY.toString() + 'px'
    }
    function toggleStopNames(props) {
      if (props.toggleStopNames) {
        return 'block'
      } else {
        return 'none'
      }
    }
    return (
      <Manager key={i}>
        <Reference>
          {({ ref }) => (
            <div ref={ref} className="stop-marker" style={styles} />
          )}
        </Reference>
        <Popper placement="left">
          {({ ref, style, placement, arrowProps }) => (
            <div
              ref={ref}
              style={{
                ...style,
                backgroundColor: 'rgba(0,0,0,0.5)',
                color: '#fff',
                borderRadius: '5px',
                marginLeft: '20px',
                display: toggleStopNames(props)
              }}
              data-placement={placement}
            >
              {`stop${i + 1}`}
              <div ref={arrowProps.ref} style={arrowProps.style} />
            </div>
          )}
        </Popper>
      </Manager>
    )
  })
}

export default Stop
