import React from 'react'
import {
  Button,
  MenuItem,
  TextField,
} from '@material-ui/core'
import { withStore } from 'freenit'
import { SketchPicker } from 'react-color'

import styles from './styles'


class EditProp extends React.Component {
  constructor(props) {
    super(props)
    if (props.data.identity) {
      this.state = props.data
      this.state.type = props.data.type || 'string'
    } else {
      this.state = {
        name: '',
        value: '',
        type: 'string',
      }
    }
  }

  editName = (event) => {
    this.setState({ name: event.target.value })
  }

  editValue = (event) => {
    this.setState({ value: event.target.value })
  }

  editType = (event) => {
    this.setState({ type: event.target.value })
  }

  changeColor = (color, event) => {
    if (this.state.identity) {
      const { design } = this.props.store
      design.setPropType('color')
      design.setPropValue(color.hex)
      design.setEditing(this.props.data)
    } else {
      this.setState({ value: color.hex })
    }
  }

  submit = (event) => {
    event.preventDefault()
    const { design } = this.props.store
    if (this.state.name === '') {
      const { notification } = this.props.store
      notification.show('Property name can not be empty')
      return
    }
    if (this.state.identity) {
      if (this.state.type !== 'color') {
        design.setPropName(this.state.name)
        design.setPropValue(this.state.value)
        design.setPropType(this.state.type)
      }
    } else {
      design.addProp(this.props.identity, this.state)
    }
    this.props.onClose()
  }

  render() {
    let valueView
    if (this.state.type === 'string') {
      valueView = (
        <TextField
          fullWidth
          label="value"
          value={this.state.value}
          onChange={this.editValue}
        />
      )
    }
    if (this.state.type === 'color') {
      const color = this.state.identity
        ? this.props.data.value
        : this.state.value
      valueView = (
        <SketchPicker
          onChange={this.changeColor}
          color={color}
        />
      )
    }
    return (
      <form onSubmit={this.submit} style={styles.form}>
        <div>
          <TextField
            select
            fullWidth
            label="type"
            value={this.state.type}
            onChange={this.editType}
          >
            <MenuItem value="string">string</MenuItem>
            <MenuItem value="color">color</MenuItem>
            <MenuItem value="file">file</MenuItem>
          </TextField>
          <TextField
            autoFocus
            fullWidth
            label="name"
            value={this.state.name}
            onChange={this.editName}
          />
          {valueView}
        </div>
        <div style={styles.buttons}>
          <Button type="Submit" variant="outlined">
            OK
          </Button>
          <Button onClick={this.props.onClose} variant="outlined">
            Cancel
          </Button>
        </div>
      </form>
    )
  }
}


EditProp.propTypes = {
}


export default withStore(EditProp)
