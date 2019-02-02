import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import Icon from '@material-ui/core/Icon';
import DeleteIcon from '@material-ui/icons/Delete';
import NavigationIcon from '@material-ui/icons/Navigation';

const styles = theme => ({
  fab: {
    margin: theme.spacing.unit,
    backgroundColor: '#2196f3'
  },
  extendedIcon: {
    marginRight: theme.spacing.unit,
  },
});
// function test(){
//     console.log('fired')
// }

function AddButton(props) {
  const { classes } = props;
  return (
    <div>
      <Fab size="small" color="primary" aria-label="Add" className={`add-button button ${classes.fab}`} onClick={(ev) => props.onClick(ev)}>
        <AddIcon/>
      </Fab>
    </div>
  );
}

AddButton.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AddButton);
