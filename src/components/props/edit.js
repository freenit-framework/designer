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

class EditProp extends React.Component {
  state = {}

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
        <DialogTitle>Edit Prop</DialogTitle>
        <DialogContent>
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

export default observer(EditProp)
