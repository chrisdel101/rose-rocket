import React from 'react'

class Dropdown extends React.Component{
    constructor(props) {
		super(props)
        this.state = {
            value:''
            }
        this.handleChange = this.handleChange.bind(this);
        this.handleSelectSubmit = this.handleSelectSubmit.bind(this);

	}
    handleChange(event) {
        console.log(event)
        this.setState({value: event.target.value});
    }
    handleSelectSubmit(event) {
        alert('Your favorite flavor is: ' + this.state.value);
        event.preventDefault();
    }

    render(){
        // console.log(this.props)
        if(this.props.legs){
            return(
                <div className="legs-container">

                <form onSubmit={this.handleSelectSubmit}>
                    <label>
                    Select a Leg
                    <select value={this.state.value} onChange={this.handleChange}>
                    {
                        this.props.legs.map((leg, i) => {
                            return <option key={i}>{leg.legID}</option>
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
