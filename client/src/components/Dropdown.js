import React from 'react'

class Dropdown extends React.Component{
    constructor(props) {
		super(props)
        this.state = {
            }
	}

    renderInput(){
        // console.log(this.props)
        return(
            <div className="progress-input-wrapper">
                Progress:  <input className="progress-input" name="progressInput" type="text" value={this.props.driverProgressInput} onChange={ev =>  this.props.onChange(ev)}>
                </input>
            </div>
        )
    }
    render(){
        if(this.props.legs){
            return(
                <div className="legs-container">

                <form name={this.props.type === 'driver' ? 'driver': 'color'} onSubmit={(ev) => this.props.onSubmit(ev)}>
                    <label>
                    {this.props.type === 'driver' ? this.props.utils.driverText: this.props.utils.colorText}
                    <select name={this.props.type === 'driver' ? 'driver-select': 'color-select'} value={this.state.value} onChange={(ev) => this.props.onChange(ev)}>
                        <option></option>
                    {
                        this.props.legs.map((leg, i) => {
                            return <option key={i} value={this.state.value}>{leg.legID}</option>
                        })
                    }
                    </select>
                    </label>
                    {this.props.type === 'driver'?
                    this.renderInput() : null
                    }
                    <input  type="submit" value="Submit" />
                </form>

                </div>
            )
        } else {
            return null
        }

    }

}

export default Dropdown
