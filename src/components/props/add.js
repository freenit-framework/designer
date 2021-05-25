import React from 'react'
import { action } from 'mobx'
import { observer } from 'mobx-react'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@material-ui/core'

import { compile } from 'utils'
import styles from './styles'

class AddProp extends React.Component {
  state = {
    name: '',
    value: '',
  }

  changeName = (event) => {
    this.setState({ name: event.target.value })
  }

  changeValue = (event) => {
    this.setState({ value: event.target.value })
  }

  submit = action(() => {
    const { name, value } = this.state
    this.props.data.value[name] = compile(value)
    this.setState({ name: '', value: '' })
    this.props.handleClose()
  })

  render() {
    return (
      <Dialog open={this.props.open} onClose={this.props.handleClose}>
        <DialogTitle>Add Prop</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            autoFocus
            label="name"
            value={this.state.name}
            onChange={this.changeName}
          />
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
