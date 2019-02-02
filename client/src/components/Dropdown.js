import React from 'react'
import MaterialSelect from './material/MaterialSelect'
import MaterialButton from './material/MaterialButton'

class Dropdown extends React.Component{
    constructor(props) {
		super(props)
        this.state = {
            }
	}

    renderInput(){
        return(
            <div className="progress-input-wrapper">
                Progress:  <input className="progress-input" name="progress-input" type="text" value={this.props.driverProgressInput} onChange={ev =>  this.props.onChange(ev)}>
                </input>
            </div>
        )
    }
    render(){

        if(this.props.legs){

            return(
                <div className="legs-container">

                <form name={this.props.type === 'driver' ? 'driver-dropdown': 'color'} onSubmit={(ev) => this.props.onSubmit(ev)}>
                    <label>
                    {this.props.type === 'driver' ? this.props.texts.driverText: this.props.texts.colorText}
                    <MaterialSelect legs={this.props.legs} value={this.state.value} onChange={this.props.onChange}>

                        <option></option>
                    {
                        this.props.legs.map((leg, i) => {
                            return <option key={i} value={this.state.value}>{leg.legID}</option>
                        })
                    }
                    </MaterialSelect>
                    </label>
                    {this.props.type === 'driver'?
                    this.renderInput() : null
                    }
                    <MaterialButton type="submit" value="Submit" size="large" color="primary" type="submit-button" text="Toggle Leg"/>

                </form>

                </div>
            )
        } else {
            return null
        }

    }

}

export default Dropdown
