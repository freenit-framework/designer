import { Button, TextField } from '@material-ui/core'
import { action } from 'mobx'
import { observer } from 'mobx-react'
import React from 'react'
import { compile } from 'utils'

import styles from './styles'

class EditProp extends React.Component {
  state = {
    value: '',
  }

  constructor(props) {
    super(props)
    this.state.value = props.data.value
  }

  changeValue = action((event) => {
    this.props.data.value = event.target.value
  })

  cancel = action(() => {
    this.props.data.value = this.state.value
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
          label="value"
          value={this.props.data.value}
          onChange={this.changeValue}
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

export default observer(EditProp)
