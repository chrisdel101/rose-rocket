import React from 'react'

class Form extends React.Component{
    constructor(props) {
		super(props)
        this.state = {
            value:''
        }
    }
    renderForm(){
// onChange={(ev) => this.props.onChange(ev.target.value)}>
        return(
            <form onSubmit={(ev) => this.props.onSubmit(ev)}>
                <label>
                    X-coords: <input className="x-coord" type="text" value={this.state.value} onChange={ev => this.props.onChange(ev)} >
                    </input>
                </label>
                <label>
                    Y-coords: <input className="y-coord" type="text" value={this.state.value} onChange={ev => this.props.onChange(ev)}  ></input>
                </label>
                <input type="submit" value="Submit" />
            </form>)

    }

    render(){
        return(
            <React.Fragment>
            {this.renderForm()}
            </React.Fragment>
        )
    }

}

export default Form
