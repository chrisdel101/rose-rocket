import React from 'react'

class Dropdown extends React.Component{
    constructor(props) {
		super(props)
        this.state = {
            progressInput: ''
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
    // static getDerivedStateFromProps(props) {
    //     if(props.values){
    //         if(props.values.x || props.values.y){
    //             console.log(props.values)
    //             return {
    //                 xVal: props.values.x,
    //                 yVal: props.values.y
    //             }
    //         }
    //         return null
    //     }
    //     return null
    // }
    renderInput(){
        // console.log(this.props)
        return(
            <div className="progress-input-wrapper">
                 X Coords: <input className="progress-input" name="driverXinput" type="text" value={this.props.values.x} onChange={ev =>  this.props.onChange(ev)}>
                </input>
                 Y Coords: <input className="progress-input" name="driverYinput" type="text" value={this.props.values.y} onChange={ev =>  this.props.onChange(ev)}>
                </input>
                Progress:  <input className="progress-input" name="progressInput" type="text" value={this.props.xVal} onChange={ev =>  this.props.onChange(ev)}>
                </input>
            </div>
        )
    }
    render(){
        // console.log(this.state)
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
