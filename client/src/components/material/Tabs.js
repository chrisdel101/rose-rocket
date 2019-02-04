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
            numberOfTabs: 1,
            hovered: false
        };
    }

  handleChange = (event, value) => {
    this.setState({ value });
  };
  addTab(){
      let driverNum = this.state.numberOfTabs + 1

      // console.log(driverNum)
      this.setState({
          numberOfTabs: driverNum
      })
  }
  // takes index to extract from array
  subtractTab(indexToRemove){

      if(this.state.numberOfTabs < 2){
          console.log('cannot subtract single driver')
          return
      }

      let numberOfTabs = this.state.numberOfTabs - 1

      this.setState({
          numberOfTabs: numberOfTabs
      })


  }
  handleAddButtonClick(e){
      this.props.onClick(e)
      this.addTab()
  }
  handleRemoveButtonClick(e){

      if(!this.state.hovered){
          return
      }
      let driverIndex = parseInt(e.target.innerText.substring(13,14)) - 1
      this.props.onClick(`${e.target.innerText} icon-click`)
      this.subtractTab(driverIndex)
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

  }
   mouseEvent(e) {
    // e = Mouse click event.
        var rect = e.target.getBoundingClientRect();
        var x = e.clientX - rect.left; //x position within the element.
        var y = e.clientY - rect.top;  //y position within the element.

        if(y <= 27 && x >= 60){
            this.setState({hovered: true})
        } else {
            this.setState({hovered: false})
        }
    }
    handleTabsClick(e){
        if(this.state.hovered){
            return
        }
        this.props.onClick(e.target.innerText)
    }
renderIcon(){
    return(<div tabIndex="-1" className="icon-wrapper">
      <Icon />
    </div>)
}
  render() {
    const { classes } = this.props;
    const { value } = this.state;
    // console.log(this.state.numberOfTabs)
    if(this.props.driversArr){
        return (
            <div className={classes.root}>


            <AppBar position="static">
            <Tabs className="tabs-element" name="tabs" value={value} onChange={this.handleChange} onClick={this.handleTabsClick.bind(this)}>
            {this.props.driversArr.map((tab, i) => {

                return <Tab icon={this.renderIcon()} onMouseMove={this.mouseEvent.bind(this)} label={tab.name} key={i} onClick={this.handleRemoveButtonClick.bind(this)}></Tab>
            })}
            <AddButton onClick={this.handleAddButtonClick.bind(this)} iconType="add"/>
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

    } else {
        return null
    }
  }
}

SimpleTabs.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(SimpleTabs);
