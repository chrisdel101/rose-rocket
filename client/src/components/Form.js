import React from 'react'

class Form extends React.Component{
    constructor(props) {
		super(props)
        this.state = {
        }
    }
    values(){
        if(this.props.values){
            console.log('p', this.props)
            let {values} = this.props
            return(
                <React.Fragment>
                X-coords: <input className="x-coord" name="x" type="text" value={this.props.values.x} onChange={this.props.onChange}>
                </input>

                Y-coords: <input className="y-coord" name="y" type="text" value={this.props.values.x} onChange={this.props.onChange}></input>
                </React.Fragment>
            )
        }
    }
    render(){
    let {values} = this.props
    console.log(this.props)
        return(
            <form onSubmit={(ev) => this.props.onSubmit(ev)}>

                    {this.props.values ?
                        <React.Fragment>
                        X-coords: <input className="x-coord" name="x" type="text" value={values.x} onChange={this.props.onChange}>
                        </input>

                        Y-coords: <input className="y-coord" name="y" type="text" value={values.y} onChange={this.props.onChange}></input>
                        </React.Fragment>
                    :
                        <React.Fragment>
                        X-coords: <input className="x-coord" name="x" type="text"  onChange={this.props.onChange}>
                        </input>

                        Y-coords: <input className="y-coord" name="y" type="text"  onChange={this.props.onChange}></input>
                        </React.Fragment>
                    }

                <input type="submit" value="Submit" />
            </form>
        )
    }

}

export default Form
