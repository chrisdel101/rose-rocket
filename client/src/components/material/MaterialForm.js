import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import MaterialButton from './MaterialButton';
import Typography from '@material-ui/core/Typography';

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
      formName: this.props.formname
  };

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  }
  renderFormType(props, classes){
      if(props.values && !props.graphSize){
          return(
              <React.Fragment>
                  <TextField
                      id="standard-name"
                      label="X-coords"
                      placeholder="1-200"
                      className={classes.textField}
                      value={props.values.x}
                      onChange={props.onChange}
                      margin="normal"
                      name="x"
                  />
                  <TextField
                      id="standard-name"
                      label="Y-coords"
                      placeholder="1-200"
                      className={classes.textField}
                      value={props.values.y}
                      onChange={props.onChange}
                      margin="normal"
                      name="y"
                  />
              </React.Fragment>
          )
      } else if(!props.values){
          return(
              <React.Fragment>
                  <TextField
                  id="standard-name"
                  label="X-coords"
                  placeholder="1-200"
                  className={classes.textField}
                  onChange={props.onChange}
                  margin="normal"
                  name="x"
                  />
                  <TextField
                  id="standard-name"
                  label="Y-coords"
                  placeholder="1-200"
                  className={classes.textField}
                  onChange={props.onChange}
                  margin="normal"
                  name="y"
                  />
              </React.Fragment>
          )
      } else if(props.values && props.graphSize){
          return(
              <React.Fragment>
               <Typography id="graph-size-label">Form</Typography>
                  <TextField
                  id="graph-size-form-x"
                  label="X length"
                  placeholder="1-100"
                  className={classes.textField}
                  onChange={props.onChange}
                  margin="normal"
                  name="x"
                  />
                  <TextField
                  id="graph-size-form-y"
                  label="Y height"
                  placeholder="1-100"
                  className={classes.textField}
                  onChange={props.onChange}
                  margin="normal"
                  name="y"
                  />
              </React.Fragment>
          )
      }
  }
  render() {
      console.log(this.props)
    const { classes } = this.props;
    return (
      <form className={`${classes.container} material-form`} noValidate autoComplete="off" name={this.state.formName} onSubmit={(ev) => this.props.onSubmit(ev)}>
        {this.renderFormType(this.props, classes)}
             <MaterialButton size={this.props.buttonsize} color="primary" type="primary-button" text="Submit" buttonNumber={3}/>
      </form>
    );
  }
}

MaterialForm.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(MaterialForm);
