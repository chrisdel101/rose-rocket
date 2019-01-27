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

                    X-coords: <input className="x-coord" name="x" type="text" value={this.state.value} onChange={ev => this.props.onChange(ev.target.value)} >
                    </input>

                    Y-coords: <input className="y-coord" name="y" type="text" value={this.state.value} onChange={ev => this.props.onChange(ev.target.value)}></input>
                    {this.state.value}
            
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
