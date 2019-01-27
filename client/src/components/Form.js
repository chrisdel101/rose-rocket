import React from 'react'

class Form extends React.Component{
    constructor(props) {
		super(props)
        this.state = {value: ''};
        this.handleXchange = this.handleXchange.bind(this);

    }
    handleXchange(event) {
        console.log(event.target.value)
        this.setState({value: event.target.value});
    }

    renderForm(){
        return(
            <form onSubmit={(ev) => this.props.onSubmit(ev)}>
                <label>

                    <input type="text" value={this.state.value} onChange={this.handleXchange} />
                </label>
                <input type="submit" value="Submit" />
            </form>)

    }
    // <label>
    //     Y-coords: <input className="y-coord" type="text" value={this.state.value} onChange={''}>
    //     </input>
    // </label>

    render(){
        return(
            <React.Fragment>
            {this.renderForm()}
            </React.Fragment>
        )
    }

}

export default Form
