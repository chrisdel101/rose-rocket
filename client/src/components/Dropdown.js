import React from 'react'
import MaterialSelect from './material/MaterialSelect'
import MaterialButton from './material/MaterialButton'
import TextField from '@material-ui/core/TextField';


const styles = theme => ({
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        width: 200,
    },
    dense: {
        marginTop: 19,
    },
    menu: {
        width: 200,
    },
})

class Dropdown extends React.Component{
    constructor(props) {
		super(props)
        this.state = {
            }
	}

    renderInput(){
        return(
            <div className="progress-input-wrapper form-child">

                <TextField
                    value={this.props.driverProgressInput}
                    id="standard-name"
                    label="Progress"
                    placeholder="Progres in Percent"
                    className={`${styles.textField} progress-input`}
                    name="progress-input"
                    onChange={ev =>  this.props.onChange(ev)}
                    margin="normal"

                />
            </div>
        )
    }
    render(){

        if(this.props.legs){

            return(
                <div className="legs-container">

                <form name={this.props.type === 'driver' ? 'driver-dropdown': 'color'} onSubmit={(ev) => this.props.onSubmit(ev)}>
                    <label className="form-child">
                    {this.props.type === 'driver' ? this.props.texts.driverText: this.props.texts.colorText}
                    <MaterialSelect legs={this.props.legs} value={this.state.value} onChange={this.props.onChange} type={this.props.type === 'driver' ? 'driver' : 'color'}>

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
                    <MaterialButton type="submit" value="Submit" size="large" color="primary" text="Toggle Leg"/>

                </form>

                </div>
            )
        } else {
            return null
        }

    }

}

export default Dropdown
