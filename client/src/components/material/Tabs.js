import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Accordion from "./Accordion";
import AddButton from "./AddButton";
import MaterialButton from "./MaterialButton";
import Icon from "./Icon";
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
  handleSecButtonClick(){
      console.log('hello')
  }
  handleIconClick(){
      console.log('click')
  }
  positioning(){
    var parent = document.querySelector('.MuiButtonBase-root-59')
    var child = document.querySelector('.material-icons.MuiIcon-root-65')
    var parentRect = parent.getBoundingClientRect()
    var childRect = child.getBoundingClientRect()
    var relativePos = {};

    relativePos.top = childRect.top - parentRect.top
    relativePos.right = childRect.right - parentRect.right
    relativePos.bottom = childRect.bottom - parentRect.bottom
    relativePos.left = childRect.left - parentRect.left;

    console.log(relativePos)

  }
   clickEvent(e) {
    // e = Mouse click event.
    var rect = e.target.getBoundingClientRect();
    var x = e.clientX - rect.left; //x position within the element.
    var y = e.clientY - rect.top;  //y position within the element.
    console.log(y)

    if(y < 27){
        let trigger = document.querySelector('.material-icons.MuiIcon-root-65')
        console.log(trigger)
        trigger.focus()

    }

}

  render() {
    const { classes } = this.props;
    const { value } = this.state;

    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Tabs className="tabs-element" name="tabs" value={value} onChange={this.handleChange} onClick={this.props.click}>
            {this.state.tabs.map((tab, i) => {
              return <Tab icon={<Icon/>} onClick={this.clickEvent.bind(this)} label={tab.label} key={i}></Tab>
            })}
            <AddButton onClick={this.handleButtonClick.bind(this)} />
            <MaterialButton  size="small" color="secondary" text="Toggle Route" type="secondary-button" onClick={this.props.onClick} buttonNumber={1}/>


          </Tabs>
        </AppBar>
            {
                this.state.tabs.map((tab, i) => {
                     return value === i && (
                        <TabContainer key={i}>
                        <Accordion
                            onClick={this.props.onClick}
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
