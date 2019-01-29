import React from 'react'
import ReactDOM from 'react-dom';
import Button from '@material-ui/core/Button';

class Switch extends React.Component{
    constructor(props){
        super(props)
        this.state = {}
    }
    render(){
        console.log(this.props  )
        return(
            <div className="button-switch">
                    <Button className={this.props.isActive.button1 ? "button" : "butto disabled"} name="coords" size="small" variant="outlined" onClick={(ev) => this.props.onClick(ev)}>
                        Coords
                    </Button>
                    <Button className={this.props.isActive.button2 ? "button" : "button disabled"} name="progress" size="small" variant="outlined" onClick={(ev) => this.props.onClick(ev)}>
                        Progress
                    </Button>
            </div>
        )
    }
}

export default Switch
