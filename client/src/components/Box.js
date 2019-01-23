import React from 'react'
import MultiRef from 'react-multi-ref';


// takes the num of boxes/cells to be produced
class Box extends React.Component{
    constructor(props) {
		super(props)
        this.state = {
            backgroundColor: true
        }
        this._items = new MultiRef();
	}

    test(i){

    }
    render(){
        console.log(this.props)


            return(
                <React.Fragment>
                <div className="box-container"></div>
                </React.Fragment>
            )
        





    }
}
// return this.arr.map((i) => {
//     return(
//         <div className="box-container" key={i} ref={this._items.ref(i)}>
//         <div className="box">
//
//         </div>
//         </div>
//     )
// })
export default Box
//
// { that.props.cellNUms ? that.props.cellNums.map(num => {
//     <div className="box-container" key={i} ref={that._items.ref(i)}>
//     {(that.props.cellNums ? console.log('hello') : null)}
//     <div className="box">
//     </div>
//     </div>
// }) :
// <div className="box-container" key={i} ref={that._items.ref(i)}>
// {(that.props.cellNums ? console.log('hello') : null)}
// <div className="box">
//
// </div>
// </div> }
