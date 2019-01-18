import React from 'react'

class Box extends React.Component{
    constructor(props) {
		super(props)
		// Don't call this.setState() here!
		this.state = {
            totalBoxSread: []

        }
    }
        componentDidMount(){
            this.setState({
                totalBoxSread: Array.from({length: this.props.totalBoxes}, (v, i) => i)
            })
            console.log(this.state)

        }

		// this.RenderMarkup = this.RenderMarkup.bind(this);


// this.boxRefs = React.createRef();
    render(){
        console.log(this.state.totalBoxSread)
        return(
            this.state.totalBoxSread === 40000 ?
      this.state.totalBoxSread.map((i) => {
            return(
                <div className="box-container" key={i}>
                <div className="box">
                </div>
                </div>
            )
        }) : null)

    }
}

export default Box
