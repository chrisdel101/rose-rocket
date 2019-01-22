import React from 'react'
import MultiRef from 'react-multi-ref';


// takes the num of boxes/cells to be produced
class Box extends React.Component{
    constructor(props) {
		super(props)
        this.state = {
            backgroundColor: true
        }
        let num = this.props.num
        this._items = new MultiRef();
        this.arr = Array.from({length: this.props.num}, (v, i) => i);
	}
    componentDidMount(){
        // let compArr = []
        // this.arr.map((i) => {
        //     compArr.push(
        //         <div className={`box-container ${(this.props.cellNums.includes(i) ? 'backgroundColor' : null)}`} key={i} ref={this._items.ref(i)}>
        //             <div className="box">
        //             </div>
        //         </div>
        //     )
        // })
        // this.setState({
        //     compArr: compArr
        // })
    }
    test(){
        if(this.props.cellNums){
            console.log('run 2')
                this.arr.map((_, i) => {
                    return(<div className={`box-container ${(this.props.cellNums.includes(i) ? 'backgroundColor' : null)}`} key={i} ref={this._items.ref(i)}>
                    <div className="box">
                    </div>
                    </div>)
                })
            } else {
                console.log('run 1')
                this.arr.map(i => {
                    return(
                        <div className="box-container" key={i} ref={this._items.ref(i)}>
                       <div className="box">
                       </div>
                       </div>)
                })
            }
    }
    render(){
        console.log(this.props)
        // this.arr.map(i => {
        //     if cellNums[i] indexes.includes(i)
        //
        //     return(<div className="box-container" key={i} ref={this._items.ref(i)}>
        //     <div className="box">
        //     </div>
        //     </div>)
        // })
        return this.arr.map(i => {
            return(
                <div className="box-container"  ref={this._items.ref(i)}>
                <div className="box">
                </div>
                </div>)

        })





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
