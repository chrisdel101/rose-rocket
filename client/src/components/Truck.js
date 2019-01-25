import React from 'react'

// takes and array of directions and pixes for x and y
function Truck(props){
    if(!props.legColor) return null
    console.log(props)
    // let start = props.legColor[0]
    // console.log(start)
    // let style = {
    //     [coord.directions.xDir]: coord.pixels.moveX.toString() + 'px',
    //     [coord.directions.yDir]: coord.pixels.moveY.toString() + 'px'
    // }
    console.log(props.legColor)
    function checkPosition(props){
        let start = props.legColor[0]
          let hasPosition = (() => {
            if (!props || !props.legColor.length || !props.legColor.includes(start)) return false;
            return true;
          })();
          return hasPosition
    }
    return(
        <div className={`truck ${checkPosition(props) ? " truck-position" : ""}`}></div>
    )
}

export default Truck
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
