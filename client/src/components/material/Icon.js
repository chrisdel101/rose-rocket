import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import black from '@material-ui/core/colors';
import Icon from '@material-ui/core/Icon';

const styles = theme => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  icon: {
    margin: theme.spacing.unit * 2,
    color: "#A0A0A0	",
    fontSize: "12px",
    position: "absolute",
    right: "-7px",
    top: "0"

  },
  iconHover: {
    margin: theme.spacing.unit * 2,
    '&:hover': {
      color: black,
    },
  },
});

function Icons(props) {
  const { classes } = props;

  return (
    <div className={classes.root}>

      <Icon className={classes.icon} color="primary" tabIndex="-1">
        close
      </Icon>
    </div>
  );
}

Icons.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Icons);
