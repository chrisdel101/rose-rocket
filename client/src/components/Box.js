import React from 'react'
import giantArray from './GiantArray'
class Box extends React.Component{
    constructor(props) {
        console.log(props)
		super(props)
		// Don't call this.setState() here!
		this.state = {
            totalBoxSread: []

        }
    }
        componentDidMount(){
            console.log(giantArray(this.props.totalBoxes))
            this.setState({
                giantArray: giantArray(this.props.totalBoxes)
            })
        }

		// this.RenderMarkup = this.RenderMarkup.bind(this);


// this.boxRefs = React.createRef();
    render(){
        return (this.state.giantArray ?
            this.state.giantArray.map((i) => {
                return(
                    <div className="box-container" key={i}>

                    <div className="box">
                    </div>
                    </div>

                )
            })
         : null)

    }
}

export default Box
//
// function Box(props){
//     let num = props.num
//     let arr = Array.from({length: num}, (v, i) => i);
//     return arr.map((i) => {
//         return(
//             <div className="box-container" key={i}>
//                 <div className="box">
//
//                 </div>
//             </div>
//         )
//     })
// }
//
// export default Box
