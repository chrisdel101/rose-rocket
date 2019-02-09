import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';

const styles = theme => ({
  fab: {
    margin: theme.spacing.unit,
    backgroundColor: '#2196f3'
  },
  extendedIcon: {
    marginRight: theme.spacing.unit,
  },
});
function renderIcon(props){
    if(props.iconType === 'add'){
        return(<AddIcon/>)
    } else if(props.iconType === 'minus'){
        return(<img className="minus-svg" src="./icons/remove_24px.svg"/>)
    }    else {
        return null
    }
}

function AddButton(props) {
  const { classes } = props;
  return (
    <div className="add-button-container">
      <Fab size="small" color="primary" aria-label="Add" className={`add-button button ${classes.fab}`} onClick={(ev) => props.onClick(ev)} data-number={props.number}>
        {renderIcon(props)}

      </Fab>
    </div>
  );
}

AddButton.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AddButton);
