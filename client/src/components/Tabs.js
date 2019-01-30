import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Accordion from "./Accordion";
import AddButton from "./AddButton";
function TabContainer(props) {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired
};

const styles = theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper
  }
});

class SimpleTabs extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            value: 0,
            tabs: [{ label: "Driver 1" }],
            numberOfTabs: 1
        };
    }

  handleChange = (event, value) => {
    this.setState({ value });
  };
  addTab(){
      let driverNum = this.state.numberOfTabs + 1
      console.log(driverNum)
      this.setState({
          numberOfTabs: driverNum ,
          tabs: [...this.state.tabs, {
              label: `Driver ${driverNum}`
          }]
      })
  }

  render() {
    const { classes } = this.props;
    const { value } = this.state;

    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Tabs value={value} onChange={this.handleChange}>
            {this.state.tabs.map((tab, i) => {
              return <Tab label={tab.label} key={i} />;
            })}
            <AddButton onClick={this.addTab.bind(this)} />
          </Tabs>
        </AppBar>
        {value === 0 && (
          <TabContainer>
            <Accordion
                onChange={this.props.onChange}
                values={this.props.values}
                legs={this.props.legs ? this.props.legs : null}
                texts={this.props.texts}
            />
          </TabContainer>
        )}
        {value === 1 && <TabContainer>Item Two</TabContainer>}
      </div>
    );
  }
}

SimpleTabs.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(SimpleTabs);
