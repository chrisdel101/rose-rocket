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
      // console.log(driverNum)
      this.setState({
          numberOfTabs: driverNum ,
          tabs: [...this.state.tabs, {
              label: `Driver ${driverNum}`
          }]
      })
  }
  handleButtonClick(){
      this.addTab()
      this.props.onClick()
  }

  render() {
    const { classes } = this.props;
    const { value } = this.state;

    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Tabs name="tabs" value={value} onChange={this.handleChange} onClick={this.props.onClick}>
            {this.state.tabs.map((tab, i) => {
              return <Tab label={tab.label} key={i} />;
            })}
            <AddButton name="add-button" onClick={this.handleButtonClick.bind(this)} />
          </Tabs>
        </AppBar>
        {
            this.state.tabs.map((tab, i) => {
                 return value === i && (
                    <TabContainer key={i}>
                    <Accordion
                        onSubmit={this.props.onSubmit}
                        onChange={this.props.onChange}
                        values={this.props.values}
                        legs={this.props.legs ? this.props.legs : null}
                        texts={this.props.texts}
                    />
                    </TabContainer>
                )

            })
        }

      </div>
    );
  }
}

SimpleTabs.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(SimpleTabs);
