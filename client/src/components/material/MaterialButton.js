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

function MaterialButton(props) {
  const { classes } = props;
  return (
      <Button variant="contained" type={props.type} size={props.size} color={props.color} className={`${props.type} button ${classes.button}`} data-number={props.buttonNumber} onClick={props.onClick}>
        {props.text}
      </Button>
  );
}

MaterialButton.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(MaterialButton);
