import React from 'react'
import { action } from 'mobx'
import { observer } from 'mobx-react'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField,
} from '@material-ui/core'

import { compile } from 'utils'
import styles from './styles'

class AddProp extends React.Component {
  state = {
    name: '',
    value: '',
    type: 'string',
  }

  changeName = (event) => {
    this.setState({ name: event.target.value })
  }

  changeValue = (event) => {
    this.setState({ value: event.target.value })
  }

  changeType = (event) => {
    this.setState({ type: event.target.value })
  }

  submit = action(() => {
    const { name, value, type } = this.state
    const { data, noname } = this.props
    let realValue
    if (value === '[]') {
      realValue = []
    } else if (value === '{}') {
      realValue = {}
    } else {
      realValue = value
    }
    if (Array.isArray(data.value)) {
      const newval = compile(realValue)
      newval.type = type
      newval.name = ''
      data.value.push(newval)
    } else {
      data.value[name] = compile(realValue)
      data.value[name].type = type
    }
    this.setState({ name: '', value: '' })
    this.props.handleClose()
  })

  render() {
    return (
      <Dialog open={this.props.open} onClose={this.props.handleClose}>
        <DialogTitle>Add Prop</DialogTitle>
        <DialogContent>
          <TextField
            select
            fullWidth
            label="type"
            value={this.state.type}
            onChange={this.changeType}
          >
            <MenuItem key="string" value="string">
              string
            </MenuItem>
            <MenuItem key="number" value="number">
              number
            </MenuItem>
            <MenuItem key="color" value="color">
              color
            </MenuItem>
            <MenuItem key="file" value="file">
              file
            </MenuItem>
          </TextField>
          {this.props.noname ? null : (
            <TextField
              fullWidth
              autoFocus
              label="name"
              value={this.state.name}
              onChange={this.changeName}
            />
          )}
          <TextField
            fullWidth
            label="value"
            value={this.state.value}
            onChange={this.changeValue}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={this.props.handleClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={this.submit} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>
    )
  }
}

export default observer(AddProp)
