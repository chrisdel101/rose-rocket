import React from 'react'

// takes and array of directions and pixes for x and y
function Truck(props){
    if(!props.coords) return null
    let coord = props.coords
    console.log(coord.pixels.moveX)
    // console.log(coord)
    let style = {
        [coord.directions.xDir]: coord.pixels.moveX.toString() + 'px',
        [coord.directions.yDir]: coord.pixels.moveY.toString() + 'px'
    }
    // console.log(style)
    // gets the cell nums to color
    function checkPosition(props){
        let start = props.coords[0]
          let hasPosition = (() => {
            if (!props || !props.coords.length || !props.coords.includes(start)) return false;
            return true;
          })();
          return hasPosition
    }
    return(
        <div className="truck" style={style}></div>
    )
}

export default Truck
// return(
//     <div className={`truck ${checkPosition(props) ? " truck-cell-position" : ""}`} style={style}></div>
// )
// renderBoxes(i) {
//     if (this.props.toRender) {
//       let { toRender, stopsColor, legsColor } = this.props;
//       return toRender.map((obj, i) => {
//         let hasStopColor = (() => {
//           if (!stopsColor || !stopsColor.length || !stopsColor.includes(i)) return false;
//           return true;
//         })();
//         let hasLegColor = (() => {
//                if (!legsColor || !legsColor.length || !legsColor.includes(i)) return false;
//                return true;
//              })();
//         return (
//             <div
//             className={`box ${hasStopColor ? " stop-color" : ""} ${hasLegColor ? " leg-color" : ""}`}
//             key={i}
//             />)
//       });
//     }
// }
// render() {
//   // console.log(this.props)
//     if (this.props.toRender && this.props.toRender.length) {
//       return <React.Fragment>{this.renderBoxes()}</React.Fragment>;
//     } else {
//       return <div>No Boxes yet!</div>;
//     }
// }
