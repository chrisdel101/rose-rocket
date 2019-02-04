import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { withStyles } from '@material-ui/core/styles';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing.unit * 2,
  },
});

class MaterialSelect extends React.Component {
  state = {
    leg: '',
    labelWidth: 0,
  };

  componentDidMount() {
    this.setState({
      labelWidth: ReactDOM.findDOMNode(this.InputLabelRef).offsetWidth,
    });
  }

  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  };

  render() {
    const { classes } = this.props;
    // console.log(this.props)
    return (
      <div className={classes.root}>

        <FormControl variant="outlined" className={classes.formControl}>
          <InputLabel
            ref={ref => {
              this.InputLabelRef = ref;
            }}
            htmlFor="outlined-age-native-simple"
          >
            Legs
          </InputLabel>
          <Select
            native
            value={this.props.value}
            onChange={this.props.onChange}
            input={
              <OutlinedInput
                name={this.props.type === 'driver' ? 'driver-select': 'color-select'}
                labelWidth={this.state.labelWidth}
                id="outlined-age-native-simple"
              />
            }
          >
          <option value="" />
          {
              this.props.legs.map((leg, i) => {
                return <option key={i} value={this.state.value}>{leg.legID}</option>
              })
          }

          </Select>
        </FormControl>

      </div>
    );
  }
}

MaterialSelect.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(MaterialSelect);
