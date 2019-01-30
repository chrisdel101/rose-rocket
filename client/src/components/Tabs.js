import React from 'react'
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import TabsComp from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';


class Tabs extends React.Component{
    constructor(props){
        super(props)
        this.state = {

        }
    }
    TabContainer(props) {
          return (
            <Typography component="div" style={{ padding: 8 * 3 }}>
              {props.children}
            </Typography>
          );
        }
    render(){
        return(
            <div className="app-bar">
                <AppBar position="static">
                <TabsComp value={this.props.value} name="tabs" onChange={(ev) => this.props.onClick(ev)} >
                <Tab label="Item One" />
                <Tab label="Item Two" />
                <Tab label="Item Three" />
                </TabsComp>
            {this.props.value === 0 && <this.TabContainer>Item One</this.TabContainer>}
            {this.props.value === 1 && <this.TabContainer>Item Two</this.TabContainer>}
            {this.props.value === 2 && <this.TabContainer>Item Three</this.TabContainer>}
                </AppBar>
            </div>
        )
    }
}

export default Tabs
