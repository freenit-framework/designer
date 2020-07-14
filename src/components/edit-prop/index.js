import React from 'react'
import {
  Button,
  MenuItem,
  TextField,
} from '@material-ui/core'
import { withStore } from 'freenit'
import { SketchPicker } from 'react-color'
import { convert } from 'components'

import styles from './styles'


class EditProp extends React.Component {
  constructor(props) {
    super(props)
    const data = {
      pre: '',
      post: '',
      file: '',
    }
    if (props.data.identity) {
      this.state = {
        ...props.data,
        ...data,
        type: props.data.type || 'string',
        pre: props.data.pre || '',
        post: props.data.post || '',
        file: props.data.file || '',
      }
    } else {
      this.state = {
        ...data,
        name: '',
        value: '',
        type: 'string',
      }
    }
  }

  fileInput = React.createRef()

  handleFileChange = (event) => {
    for (let i = 0; i < event.target.files.length; ++i) {
      const reader = new FileReader()
      reader.onload = (e) => this.setState({
        file: e.target.result,
      })
      reader.readAsDataURL(event.target.files[i])
    }
  }

  openFileBrowser = () => {
    this.fileInput.current.click()
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

  editPre = (event) => {
    this.setState({ pre: event.target.value })
  }

  editPost = (event) => {
    this.setState({ post: event.target.value })
  }

  changeColor = (color, event) => {
    const { a } = color.rgb
    const alpha = Math.ceil(255 * a).toString(16)
    const value = `${color.hex}${alpha}`
    if (this.state.identity) {
      if (this.props.flavor === 'theme') {
        const { theme } = this.props.store
        theme.setPropValue(this.props.data, value)
      } else {
        const { editing, selected, tree } = this.props.store
        tree.setPropValue(value, selected.selected, this.props.data.identity)
        editing.setEditing({ ...this.props.data })
      }
    } else {
      this.setState({ value: value })
    }
  }

  submit = (event) => {
    event.preventDefault()
    const { notification, selected, theme, tree } = this.props.store
    if (this.state.name === '') {
      notification.show('Property name can not be empty')
      return
    }
    let complex
    let value
    if (this.state.value === '{}') {
      complex = true
      value = convert('value', {})
    } else if (this.state.value === '[]') {
      complex = true
      value = convert('value', [])
    } else if (this.state.type === 'number') {
      value = Number(this.state.value)
    } else {
      value = this.state.value
    }
    if (this.state.identity) {
      const { identity } = this.state
      if (this.state.type === 'color') {
        if (this.props.flavor === 'theme') {
          theme.setPropType(this.props.data, this.state.type)
        } else {
          tree.setPropType(this.state.type, selected.selected, identity)
        }
      } else if (this.state.type === 'file'){
        if (this.props.flavor === 'theme') {
          theme.setPropName(this.props.data, this.state.name)
          theme.setPropType(this.props.data, this.state.type)
          theme.setPropFile(this.props.data, this.state)
        } else {
          tree.setPropName(this.state.name, selected.selected, identity)
          tree.setPropType(this.state.type, selected.selected, identity)
          tree.setPropFile(this.props.data, this.state)
        }
      } else {
        if (this.props.flavor === 'theme') {
          theme.setPropName(this.props.data, this.state.name)
          theme.setPropType(this.props.data, this.state.type)
          theme.setPropValue(this.props.data, this.state.value)
        } else {
          tree.setPropName(this.state.name, selected.selected, identity)
          tree.setPropType(this.state.type, selected.selected, identity)
          if (!complex) { tree.setPropValue(value, selected.selected, identity) }
        }
      }
    } else {
      if (this.props.flavor === 'theme') {
        theme.addProp(
          this.props.identity,
          { ...this.state, value },
        )
      } else {
        tree.addProp(
          this.props.identity,
          { ...this.state, value },
          selected.selected,
        )
      }
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
    if (this.state.type === 'number') {
      valueView = (
        <TextField
          fullWidth
          label="value"
          type="number"
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
    if (this.state.type === 'file') {
      valueView = (
        <div style={styles.file}>
          <TextField
            fullWidth
            label="pre"
            value={this.state.pre}
            onChange={this.editPre}
          />
          <TextField
            fullWidth
            label="post"
            value={this.state.post}
            onChange={this.editPost}
          />
          <Button
            variant="outlined"
            style={styles.buttons}
            onClick={this.openFileBrowser}
          >
            Browse
          </Button>
        </div>
      )
    }
    const nameView = this.state.identity
      ? null
      : (
        <TextField
          autoFocus
          fullWidth
          label="name"
          value={this.state.name}
          onChange={this.editName}
        />
      )
    return (
      <form onSubmit={this.submit} style={styles.form}>
        <input
          ref={this.fileInput}
          type="file"
          style={styles.input}
          onChange={this.handleFileChange}
        />
        <div>
          <TextField
            select
            fullWidth
            label="type"
            value={this.state.type}
            onChange={this.editType}
          >
            <MenuItem value="string">string</MenuItem>
            <MenuItem value="number">number</MenuItem>
            <MenuItem value="color">color</MenuItem>
            <MenuItem value="file">file</MenuItem>
          </TextField>
          {nameView}
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


export default withStore(EditProp)
