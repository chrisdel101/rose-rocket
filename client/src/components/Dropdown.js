import React from 'react'

class Dropdown extends React.Component{
    constructor(props) {
		super(props)
        this.state = {
            }
        // this.handleChange = this.handleChange.bind(this);

	}
    // handleChange(event) {
    //     console.log(event)
    //     this.setState({value: event.target.value});
    // }
    // handleSelectSubmit(event) {
    //     alert('Your favorite flavor is: ' + this.state.value);
    //     event.preventDefault();
    // }

    render(){
        console.log(this.state)
        if(this.props.legs){
            return(
                <div className="legs-container">

                <form onSubmit={(ev) => this.props.onSubmit(ev)}>
                    <label>
                    Select a Leg
                    <select value={this.state.value} onChange={(ev) => this.props.onChange(ev.target.value)}>
                        <option></option>
                    {
                        this.props.legs.map((leg, i) => {
                            return <option key={i} value={this.state.value}>{leg.legID}</option>
                        })
                    }
                    </select>
                    </label>
                    <input type="submit" value="Submit" />
                </form>

                </div>
            )
        } else {
            return null
        }

    }

}

export default Dropdown
