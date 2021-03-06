import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import green from '@material-ui/core/colors/green';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import Favorite from '@material-ui/icons/Favorite';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';

const styles = {
  root: {
    color: green[600],
    '&$checked': {
      color: green[500],
    },
  },
  checked: {},
};

class CheckboxLabels extends React.Component {
  state = {
    checkedA: false,
    checkedB: false,
    checkedC: false
  };

  handleChange = () => event => {
    let name  = this.props.value
    if(this.props.onChange){
        this.props.onChange(event)
    }
    this.setState({ [name]: event.target.checked });
 };
 checkedState(){
     if(this.props.value === "checkedA"){
         return this.state.checkedA
     } else if(this.props.value === "checkedB"){
         return this.state.checkedB
     } else if(this.props.value === "checkedC"){
         return this.state.checkedC
     }
 }
  render() {
    const { classes } = this.props;
    return (
      <FormGroup row  className='checkbox-container'>
        <FormControlLabel
          control={
            <Checkbox
              checked={this.checkedState()}
              onChange={this.handleChange()}
              value={this.props.value}
              name={this.props.name}
            />

          }
          label={this.props.label}
        />

      </FormGroup>
    );
  }
}

CheckboxLabels.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(CheckboxLabels);
