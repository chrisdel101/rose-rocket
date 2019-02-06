import React from 'react'
import Typography from '@material-ui/core/Typography';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Dropdown from '../Dropdown'
import MaterialButton from './MaterialButton'
import MaterialForm from './MaterialForm'





const styles = theme => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: '33.33%',
    flexShrink: 0,
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
})

class Accordion extends React.Component {
  state = {
    expanded: null,
  };

  handleChange = panel => (event, expanded) => {
    this.setState({
      expanded: expanded ? panel : false,
    });
  };

  render() {
    const { classes } = this.props;
    const { expanded } = this.state;

    return (
      <div className={classes.root}>
        <ExpansionPanel className='top-panel' expanded={expanded === 'panel1'} onChange={this.handleChange('panel1')}>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography className={classes.heading}>Set Driver Coordinates</Typography>
            <Typography className={classes.secondaryHeading}>Set driver postion with coordinates.
            </Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
          <MaterialForm
              onChange={this.props.onChange}
              onSubmit={this.props.onSubmit}
              values={this.props.values}
             />
            <Typography>

            </Typography>
          </ExpansionPanelDetails>
        </ExpansionPanel>
        <ExpansionPanel className='top-panel' expanded={expanded === 'panel2'} onChange={this.handleChange('panel2')}>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography className={classes.heading}>Set Driver Leg</Typography>
            <Typography className={classes.secondaryHeading}>
              Set driver position with leg and progress.
            </Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails className="second-panel">
          <Dropdown
                onChange={this.props.onChange}
                onSubmit={this.props.onSubmit}
                legs={this.props.legs ? this.props.legs : null}
                type="driver"
                texts={this.props.texts}
          />
            <Typography>
            </Typography>
          </ExpansionPanelDetails>
        </ExpansionPanel>

        <ExpansionPanel className='top-panel' expanded={expanded === 'panel3'} onChange={this.handleChange('panel3')}>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography className={classes.heading}>Legs & Progress</Typography>
            <Typography className={classes.secondaryHeading}>Highlight completed route and legs.</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails className="third-panel">
          <Dropdown
                onChange={this.props.onChange}
                onSubmit={this.props.onSubmit}
                legs={this.props.legs ? this.props.legs : null}
                type="color"
                texts={this.props.texts}
          />
          <MaterialButton size="large" color="primary" type="secondary-button" text="Progess" buttonNumber={2} onClick={this.props.onClick}/>

            <Typography>

            </Typography>
          </ExpansionPanelDetails>
        </ExpansionPanel>

      </div>
    );
  }
}

Accordion.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Accordion);





// type="color"
// utils={this.state.utils}
// legs={this.state.legs.length ? this.state.legs : null}
// onChange={this.handleDropdownChange} onSubmit={this.handleDropdownSubmit}
