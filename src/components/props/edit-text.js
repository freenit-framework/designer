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

import store from 'store'
import { compile } from 'utils'
import styles from './styles'

class EditText extends React.Component {
  state = {
    text: '',
  }

  constructor(props) {
    super(props)
    this.state.text = store.design.selected.text
  }

  changeText = action((event) => {
    store.design.selected.text = event.target.value
  })

  cancel = action(() => {
    store.design.selected.text = this.state.text
    this.props.handleClose()
  })

  submit = () => {
    this.props.handleClose()
  }

  render() {
    return (
      <Dialog open={this.props.open} onClose={this.cancel}>
        <DialogTitle>Edit Text</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="name"
            value={store.design.selected.text}
            onChange={this.changeText}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={this.cancel} color="secondary">
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

export default observer(EditText)
