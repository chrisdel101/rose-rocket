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
import Checkbox from "./Checkbox";
import ReactTooltip from 'react-tooltip'



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

const styles = (theme, color) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper
    },
    indicator: {
        backgroundColor: color
  }
})

class SimpleTabs extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            value: 0,
            tabs: [{ label: "Driver 1" }],
            numberOfTabs: 1,
            hovered: false,
            checkedA: true,
            checkedB: false,
            checkedC: false
        };
    }
// handle check boxes
  handleChange = (event, value) => {
      if(event.target.name === "float-toggle"){
          this.props.onChange(event)
          return
      }
      if(event.target.name === "toggle"){
          this.props.onChange(event)
          return
      } else if(event.target.name === "stop-name-toggle"){
          this.props.onChange(event)
          return
      }
    this.setState({ value: this.props.selectedDriver });
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
      this.setState({value: this.props.selectedDriver})
      // console.log(this.state.value)
  }
  handleRemoveButtonClick(e){
      if(!this.state.hovered){
          return
      }
      console.log('HERE')
      let driverIndex = parseInt(e.target.innerText.substring(13,14)) - 1
      this.props.onClick({event: e, iconClick:true, cursor:true})
      this.subtractTab(driverIndex)
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
        console.log()
        this.props.onClick({event: e, iconClick:false, cursor:true})
    }

    renderIcon(){
        return(
            <div tabIndex="-1" className="icon-wrapper">
              <Icon
                className="close-icon"
                strType="close"
                />
            </div>)
    }
  render() {
    const { classes } = this.props;
    const { value } = this.state;
    if(this.props.cursorArr){
        return (
            <div className={classes.root}>
            <AppBar position="static">

                <Tabs

                    classes={{
                        indicator: classes.indicator
                    }}
                    className="tabs-element"
                    name="tabs"
                    value={this.props.selectedDriver}
                    onChange={this.handleChange}
                    onClick={this.handleTabsClick.bind(this)} >

                {
                    this.props.cursorArr.map((tab, i) => {

                    return(
                        <div>
                            <Tab
                                data-tip="Click to Hide Cursor"
                                data-key={i}
                                icon={this.renderIcon()} onMouseMove={this.mouseEvent.bind(this)}
                                label={tab.name}
                                key={i}
                                onClick={this.handleRemoveButtonClick.bind(this)}>
                           </Tab>
                           <ReactTooltip />
                        </div>)
                       })
                }
                <AddButton
                    onClick={this.handleAddButtonClick.bind(this)}
                    />
                    <div className="checkboxes">
                        <Checkbox
                            checkedProps={this.state.checkedA}
                            value="checkedA"
                            name="float-toggle"
                            label="Floating Controls"/>
                        <Checkbox
                            value="checkedB"
                            name="stop-name-toggle"
                            label="Show Stop Names"/>
                    </div>

                <MaterialButton
                    size="small"
                    color="secondary"
                    text="Toggle Route"
                    type="secondary-button"
                    onClick={this.props.onClick}
                    buttonNumber={1}/>

            </Tabs>

            </AppBar>

                <TabContainer>

                <Accordion
                    onClick={this.props.onClick}
                    onSubmit={this.props.onSubmit}
                    onChange={this.props.onChange}

                    values={this.props.values}

                    legs={this.props.legs ? this.props.legs : null}
                    texts={this.props.texts}
                    />
                </TabContainer>
            </div>
        )
    } else {
        return null
    }
  }
}

SimpleTabs.propTypes = {
  classes: PropTypes.object.isRequired
};


export default withStyles(styles)(SimpleTabs);
