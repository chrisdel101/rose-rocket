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

                    X-coords: <input className="x-coord" name="x" type="text"  onChange={this.props.onChange}>
                    </input>

                    Y-coords: <input className="y-coord" name="y" type="text"  onChange={this.props.onChange}></input>

                <input type="submit" value="Submit" />
            </form>
        )
    }

}

export default Form
