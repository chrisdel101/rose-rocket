import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import Select from './Select'
import Icon from "./Icon";


function rand() {
  return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    width: '500px',
    display: 'flex',
    flexDirection: 'row-reverse',
    justifyContent: 'center',
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}
function getModalRighStyle() {
  const top = 50
  const right = 20

  return {
    top: `${top}px`,
    right: `${right}px`,
    transform: `translate(-${top}%, -${right}%)`,
  };
}

const styles = theme => ({
  paper: {
    position: 'absolute',
    width: theme.spacing.unit * 50,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4,
    outline: 'none',
  },
});

class SimpleModal extends React.Component {
    constructor(){
        super()
        this.state = {
            open: false,
            cells: ""
        };

        this.makeRange = this.makeRange.bind(this)
    }

  handleOpen = (e) => {
      console.log(e)
    this.setState({ open: true });
  };

  handleClose = (e) => {
    this.setState({ open: false });
    this.props.onChange(e)
    console.log(this.state.open)
  };

  // make range for select dropdowns
  makeRange(){
    let num = this.props.cells
    let arr = Array.from({length: num}, (v, i) => i)
    return arr
  }
  componentDidMount(){
      let that = this
      // set state from parent to open modal
      setTimeout(function(){
          that.setState({
              open:that.props.open
          })
          },1000)
  }
  componentDidUpdate(){
      // when parent updates the state, it will register here
      if(this.props.open !== this.state.open){
          this.setState({
              open: this.props.open
          })
      }
  }
  handleSelectChange(e){
      this.props.onChange(e)
  }
  handleSubmit(e){
      this.props.onSubmit(e)
  }
  handleClick(e){
      if(e.target.classList && e.target.classList.contains('close-icon')){
          this.handleClose(e)
      } else if(e.target.classList && e.target.classList.contains('modal-submit')){
          this.handleSubmit(e)
      }
  }
  renderIcon(){
      let that = this
      return(
          <div tabIndex="-1" className="icon-wrapper">
            <Icon
              className="close-icon"
              strType="close"
              onClick={that.handleClick.bind(that)}
              />
          </div>)
  }
  renderInputModal(classes){
      let cellsrange = this.makeRange(this.props.cells)
    return(
        <React.Fragment>
          <Modal
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
            open={this.state.open}
            onClose={this.handleClose}
            onClick={this.handleClick.bind(this)}>
            <div style={getModalStyle()} className={`${classes.paper} modal`}>
            <div className="modal-right modal-col">
            <Icon
              className="close-icon"
              strType="close"
              />
              <Typography variant="h6" id="modal-title">
                Set your plot points
              </Typography>
              <Typography variant="subtitle1" id="simple-modal-description">
              <Select
                  cells={cellsrange}
                  onChange={this.handleSelectChange.bind(this)}
                  />
              </Typography>
              </div>
              <SimpleModalWrapped />
              <div className="modal-lef modal-col">
                  <Typography variant="h6" id="modal-title">
                    Plotted Points
                  </Typography>
                 {this.renderPlotsList(this.props)}

              </div>
            </div>
          </Modal>
        </React.Fragment>
    )
  }
  renderPlotsList(props){
      if(!props.plots) return
    return(
        <div className="plots-list">
            <ol>
            {   props.plots.map((plot,i) => {
                return(
                    <li key={i}><strong>X</strong>: {plot.x}&nbsp;&nbsp;&nbsp; <strong>Y</strong>:{plot.y}</li>
                )
                })
            }
            </ol>
            <button className="modal-submit" onClick={this.handleClick.bind(this)}>Graph it</button>
        </div>
    )
  }
  render() {
    const { classes } = this.props;
        return (
            <React.Fragment>
                {this.renderInputModal(classes)}
            </React.Fragment>
    )
  }
}

SimpleModal.propTypes = {
  classes: PropTypes.object.isRequired,
};

// We need an intermediary variable for handling the recursive nesting.
const SimpleModalWrapped = withStyles(styles)(SimpleModal);

export default SimpleModalWrapped;
