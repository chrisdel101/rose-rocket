import React from 'react'

class Form extends React.Component{
    constructor(props) {
		super(props)
        this.state = {
            xVal:'',
            yVal:'',
            that: this
        }
    }
    updateState(){
        // console.log(this.props)
        // this.setState({
        //     xVal: this.props.values.x,
        //     yVal: this.props.values.y
        // })
    }
    componentDidMount(){
        // this.updateState()
        // setTimeout(function(){
        //
        // })
    }
    // static getDerivedStateFromProps(props) {
    //     // console.log(props)
    //     if(props.values.x || props.values.y){
    //         return {
    //             xVal: props.values.x,
    //             yVal: props.values.y
    //         }
    //     }
    //     return null
    // }
    renderForm(){
        return(
            <form onSubmit={(ev) => this.props.onSubmit(ev)}>

                    X-coords: <input className="x-coord" name="x" type="text" value={this.props.values.x} onChange={ev =>  this.props.onChange(ev)}>
                    </input>

                    Y-coords: <input className="y-coord" name="y" type="text" value={this.props.values.y} onChange={ev => this.props.onChange(ev)}></input>

                <input type="submit" value="Submit" />
            </form>)

    }

    render(){
// console.log(this .props)
        return(
            <React.Fragment>
            {this.renderForm()}
            </React.Fragment>
        )
    }

}

export default Form
