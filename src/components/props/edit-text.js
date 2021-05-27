import React from 'react'
import { action } from 'mobx'
import { observer } from 'mobx-react'
import { Button, TextField } from '@material-ui/core'

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

  submit = (event) => {
    event.preventDefault()
    this.props.handleClose()
  }

  render() {
    return (
      <form onSubmit={this.submit}>
        <TextField
          fullWidth
          autoFocus
          label="text"
          value={store.design.selected.text}
          onChange={this.changeText}
        />
        <Button onClick={this.cancel} color="secondary">
          Cancel
        </Button>
        <Button type="submit" color="primary">
          OK
        </Button>
      </form>
    )
  }
}

export default observer(EditText)
