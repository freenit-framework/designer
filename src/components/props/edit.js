import React from 'react'
import { Button, TextField, MenuItem } from '@material-ui/core'
import { action } from 'mobx'
import { observer } from 'mobx-react'
import { compile } from 'utils'

import styles from './styles'

class EditProp extends React.Component {
  state = {
    value: '',
    type: '',
  }

  constructor(props) {
    super(props)
    this.state.value = props.data.value
    this.state.type = props.data.type
  }

  changeValue = action((event) => {
    this.props.data.value = event.target.value
  })

  changeType = action((event) => {
    this.props.data.type = event.target.value
  })

  cancel = action(() => {
    const { value, type } = this.state
    const { data } = this.props
    data.value = value
    data.type = type
    this.props.handleClose()
  })

  submit = (event) => {
    event.preventDefault()
    this.props.handleClose()
  }

  render() {
    let type
    const { data } = this.props
    if (data.type === 'number') {
      type = 'number'
    } else if (data.type === 'color') {
      type = 'color'
    } else {
      type = 'text'
    }
    return (
      <form onSubmit={this.submit}>
        <TextField
          select
          fullWidth
          label="type"
          value={data.type}
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
        <TextField
          fullWidth
          autoFocus
          type={type}
          label={this.props.name}
          value={data.value}
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
