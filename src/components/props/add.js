import React from 'react'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Switch,
  TextField,
} from '@material-ui/core'
import { action } from 'mobx'
import { observer } from 'mobx-react'
import { compile } from 'utils'

import styles from './styles'

class AddProp extends React.Component {
  state = {
    browser: false,
    file: '',
    name: '',
    post: ')',
    pre: 'url(',
    value: '',
    type: 'string',
  }

  fileInput = React.createRef()
  openFileBrowser = () => this.fileInput.current.click()

  change = (name) => (event) => {
    this.setState({ [name]: event.target.value })
  }

  changeValue = (event) => {
    const { type } = this.state
    const { target } = event
    let value = type === 'bool' ? target.checked : target.value
    if (type === 'number') {
      value = Number(value)
    } else if (type === 'bool') {
      if (value === 'true') {
        value = true
      } else if (value === 'false') {
        value = false
      } else {
        value = Boolean(value)
      }
    }
    this.setState({ value })
  }

  changeType = (event) => {
    const type = event.target.value
    let { value } = this.state
    if (type === 'number') {
      value = Number(value)
    } else if (type === 'bool') {
      if (value === 'true') {
        value = true
      } else if (value === 'false') {
        value = false
      } else {
        value = Boolean(value)
      }
    }
    this.setState({ type, value })
  }

  handleFileChange = (event) => {
    for (let i = 0; i < event.target.files.length; ++i) {
      const reader = new FileReader()
      reader.onload = (e) =>
        this.setState({
          file: e.target.result,
        })
      reader.readAsDataURL(event.target.files[i])
    }
  }

  submit = action((event) => {
    event.preventDefault()
    const { name, value, type, file, pre, post } = this.state
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
      data.value.push(newval)
    } else if (type === 'file') {
      data.value[name] = compile(file)
      data.value[name].type = type
      data.value[name].pre = pre
      data.value[name].post = post
    } else {
      data.value[name] = compile(realValue)
      data.value[name].type = type
    }
    this.setState({
      name: '',
      value: '',
      file: '',
      pre: 'url(',
      post: ')',
      type: 'string',
    })
    this.props.handleClose()
  })

  render() {
    let type
    if (this.state.type === 'number') {
      type = 'number'
    } else if (this.state.type === 'color') {
      type = 'color'
    } else if (this.state.type === 'file') {
      type = 'file'
    } else if (this.state.type === 'bool') {
      type = 'checkbox'
    } else {
      type = 'text'
    }
    const style = type === 'file' ? styles.input : {}
    const fileView =
      this.state.type === 'file' ? (
        <>
          <input
            ref={this.fileInput}
            type="file"
            style={styles.input}
            onChange={this.handleFileChange}
          />
          <div style={styles.center}>
            <TextField
              fullWidth
              label="pre"
              value={this.state.pre}
              onChange={this.change('pre')}
            />
            &nbsp;
            <TextField
              fullWidth
              label="post"
              value={this.state.post}
              onChange={this.change('post')}
            />
          </div>
          <div>
            <Button
              variant="outlined"
              style={styles.browse}
              onClick={this.openFileBrowser}
            >
              Browse
            </Button>
          </div>
        </>
      ) : null
    const valueView =
      this.state.type === 'bool' ? (
        <>
          <Switch
            checked={this.state.value}
            onChange={this.changeValue}
            color="primary"
          />
          {this.state.value ? 'true' : 'false'}
        </>
      ) : (
        <TextField
          fullWidth
          autoFocus={this.props.noname}
          label="value"
          type={type}
          style={style}
          value={this.state.value}
          onChange={this.changeValue}
        />
      )
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
            <MenuItem key="bool" value="bool">
              bool
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
              onChange={this.change('name')}
            />
          )}
          {fileView}
          {valueView}
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
