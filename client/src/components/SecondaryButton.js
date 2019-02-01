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
      <Button variant="contained" color="secondary" className={`secondary-button button ${classes.button}`}>
        Color Stops
      </Button>
  );
}

SecondaryButton.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SecondaryButton);
