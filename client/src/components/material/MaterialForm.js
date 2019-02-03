import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import MaterialButton from './MaterialButton';

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
});

class MaterialForm extends React.Component {
  state = {

  };

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };
  render() {
      // console.log(this.props)
    const { classes } = this.props;
    // let updatedValue = {}
    // if(this.props.values){
    //     updatedValue.x=this.props.values.x
    //     updatedValue.y=this.props.values.y
    // } else {
    //     updatedValue = undefined
    // }
    return (
      <form className={classes.container} noValidate autoComplete="off" name="driver-form" onSubmit={(ev) => this.props.onSubmit(ev)}>
        {this.props.values ?
            <React.Fragment>
                <TextField
                    id="standard-name"
                    label="X-coords"
                    placeholder="1-200"
                    className={classes.textField}
                    value={this.props.values.x}
                    onChange={this.props.onChange}
                    margin="normal"
                    name="x"
                />
                <TextField
                    id="standard-name"
                    label="Y-coords"
                    placeholder="1-200"
                    className={classes.textField}
                    value={this.props.values.y}
                    onChange={this.props.onChange}
                    margin="normal"
                    name="y"
                />
            </React.Fragment>
            :
            <React.Fragment>
                <TextField
                id="standard-name"
                label="X-coords"
                placeholder="1-200"
                className={classes.textField}
                onChange={this.props.onChange}
                margin="normal"
                name="x"
                />
                <TextField
                id="standard-name"
                label="Y-coords"
                placeholder="1-200"
                className={classes.textField}
                onChange={this.props.onChange}
                margin="normal"
                name="y"
                />
            </React.Fragment>
        }
             <MaterialButton size="large" color="primary" type="primary-button" text="Submit" buttonNumber={3}/>
      </form>
    );
  }
}

MaterialForm.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(MaterialForm);
