import React from 'react'

class Form extends React.Component{
    constructor(props) {
		super(props)
        this.state = {
        }
    }s
    render(){
// console.log(this .props)
        return(
            <form onSubmit={(ev) => this.props.onSubmit(ev)}>

                    X-coords: <input className="x-coord" name="x" type="text" value={this.props.values.x} onChange={ev =>  this.props.onChange(ev)}>
                    </input>

                    Y-coords: <input className="y-coord" name="y" type="text" value={this.props.values.y} onChange={ev => this.props.onChange(ev)}></input>

                <input type="submit" value="Submit" />
            </form>
        )
    }

}

export default Form
