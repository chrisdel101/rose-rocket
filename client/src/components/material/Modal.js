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
  const top = 50 + rand();
  const left = 50 + rand();

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}
function getModal2lStyle() {
  const top = 100
  const left = 100

  return {
    top: `${top}px`,
    left: `${left}px`,
    transform: `translate(-${top}%, -${left}%)`,
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

  // make range for selects
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
  createNewPlot(){

  }
  renderInputModal(classes){
    return(
        <React.Fragment>
          <Typography gutterBottom>Click to get the full Modal experience!
          </Typography>
          <Button onClick={this.createNewPlot}>Add next point</Button>
          <Modal
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
            open={this.state.open}
            onClose={this.handleClose}
          >
            <div style={getModalStyle()} className={classes.paper}>

              <Typography variant="h6" id="modal-title">
                Set your plot points
              </Typography>
              <Typography variant="subtitle1" id="simple-modal-description">
              <Select
                  cells={this.state.cells}
                  onChange={this.handleSelectChange.bind(this)}
                  />
              </Typography>
              <SimpleModalWrapped />
            </div>
          </Modal>
        </React.Fragment>
    )
  }
  renderDisplayPlotsModal(classes){
      return(
          <React.Fragment>
            <Button onClick={this.createNewPlot}>Add next point</Button>
            <Modal
              aria-labelledby="simple-modal-title"
              aria-describedby="simple-modal-description"
              open={this.props.plotsModalOpen}
              onClose={this.handleClose}
            >
              <div style={getModal2lStyle()} className={classes.paper}>

                <Typography variant="h6" id="modal-title">
                  Plotted Points
                </Typography>
                <Typography variant="subtitle1" id="simple-modal-description">
                </Typography>
                <SimpleModalWrapped />
              </div>
            </Modal>
          </React.Fragment>
      )

  }
  render() {
    const { classes } = this.props;
        return (
            <React.Fragment>
                {this.renderInputModal(classes)}
                {this.renderDisplayPlotsModal(classes)}
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
