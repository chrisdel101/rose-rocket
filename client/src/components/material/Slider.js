import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/lab/Slider';

const styles = {
  root: {
    width: 300,
  },
  slider: {
    padding: '22px 0px',
  },
};

class SimpleSlider extends React.Component {
  state = {
    value: 50,
  };

  handleChange = (event, value) => {
      this.props.onChange({event: event, value:value})
    this.setState({ value });
  };

  render() {
    const { classes } = this.props;
    const { value } = this.state;
    // console.log(this.state.value)
    return (
      <div className={`${classes.root} slider `}>
        <Typography id="label">{this.props.label}</Typography>
        <Slider
            step={1}
          classes={{ container: classes.slider }}
          value={value}
          aria-labelledby="label"
          onChange={this.handleChange}
        />
      </div>
    );
  }
}

SimpleSlider.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SimpleSlider);
