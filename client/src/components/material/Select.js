import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing.unit * 2,
  },
})

class SimpleSelect extends React.Component {
  state = {
    value: '',
    name: '',
    xSelect: '',
    ySelect: ''
  }
  handleChange = event => {
      console.log(event.target.name)
      console.log(event.target.value)
      this.props.onChange(event)
    this.setState({ [event.target.name]: event.target.value })

  }

  render() {
    const { classes } = this.props
    // console.log(this.props.cells)
    return (
      <form className={classes.root} autoComplete="off">
        <FormControl className={`${classes.formControl} regular`}>
          <InputLabel htmlFor="age-simple">X</InputLabel>
          <Select
            value={this.state.xSelect}
            onChange={this.handleChange}
            inputProps={{
              name: 'xSelect',
              id: 'x-simple-select',
            }}
            ref={this.ref1}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            { this.props.cells.map((cell,i) => {
            return <MenuItem value={cell+1} key={i}>{cell+1}</MenuItem>
               })
            }

          </Select>
        </FormControl>
        <FormControl className={classes.formControl}>
          <InputLabel htmlFor="age-simple">Y</InputLabel>
          <Select
            value={this.state.ySelect}
            onChange={this.handleChange}
            inputProps={{
              name: 'ySelect',
              id: 'y-simple-select',
            }}
            ref={this.ref2}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            { this.props.cells.map((cell,i) => {
            return <MenuItem value={cell+1} key={i}>{cell+1}</MenuItem>
               })
            }
          </Select>
        </FormControl>

      </form>
    )
  }
}

SimpleSelect.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(SimpleSelect)
