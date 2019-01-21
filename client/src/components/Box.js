import React from 'react'
import MultiRef from 'react-multi-ref';


// takes the num of boxes/cells to be produced
class Box extends React.Component{
    constructor(props) {
		super(props)
        let num = this.props.num
        this._items = new MultiRef();
        this.arr = Array.from({length: this.props.num}, (v, i) => i);
	}
    render(){
        return this.arr.map((i) => {
            return(
                <div className="box-container" key={i} ref={this._items.ref(i)}>
                {(this.props.cellNums ? console.log(this.props) : null)}
                <div className="box">

                </div>
                </div>
            )
        })

    }
}

export default Box
