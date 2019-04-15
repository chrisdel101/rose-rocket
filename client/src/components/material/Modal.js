import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import Select from './Select'

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
  state = {
    open: false,
    cells: ""
  };

  handleOpen = (e) => {
      console.log(e)
    this.setState({ open: true });
  };

  handleClose = (e) => {
    this.setState({ open: false });
  };

  // make range for select dropdowns
  makeRange(){
    let num = this.props.cells
    let arr = Array.from({length: num}, (v, i) => i)
    this.setState({
        cells: arr
    })
  }
  componentDidMount(){
      this.makeRange()
      let that = this
      // set state from parent to open modal
      setTimeout(function(){
          that.setState({
              open:that.props.setModalOpen
          })
          },1000)
  }
  handleSelectChange(e){
      this.props.onChange(e)
  }
  handleClick(e){

  }
  renderInputModal(classes){
    return(
        <React.Fragment>
          <Modal
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
            open={this.state.open}
            onClose={this.handleClose}>
            <div style={getModalStyle()} className={`${classes.paper} modal`}>
            <div className="modal-right modal-col">
              <Typography variant="h6" id="modal-title">
                Set your plot points
              </Typography>
              <Typography variant="subtitle1" id="simple-modal-description">
              <Select
                  cells={this.state.cells}
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
            {   props.plots.map(plot => {
                return(
                    <li><strong>X</strong>: {plot.x}&nbsp;&nbsp;&nbsp; <strong>Y</strong>:{plot.y}</li>
                )
                })
            }
            </ol>
            <button onClick={this.handleClick}>Graph it</button>
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
