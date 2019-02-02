import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
  },
  input: {
    display: 'none',
  },
});

function SecondaryButton(props) {
  const { classes } = props;
  return (
      <Button variant="contained" size="small" color="secondary" className={`secondary-button button ${classes.button}`} data-number={props.buttonNumber} onClick={props.onClick}>
        {props.text}
      </Button>
  );
}

SecondaryButton.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SecondaryButton);
