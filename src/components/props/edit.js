import React from 'react'
import { Button, TextField, MenuItem, Switch } from '@material-ui/core'
import { action } from 'mobx'
import { observer } from 'mobx-react'
import { compile } from 'utils'

import styles from './styles'

class EditProp extends React.Component {
  state = {
    value: '',
    type: '',
    pre: '',
    post: '',
  }

  fileInput = React.createRef()
  openFileBrowser = () => this.fileInput.current.click()
  timeout = null

  constructor(props) {
    super(props)
    this.state.value = props.data.value
    this.state.type = props.data.type
    this.state.pre = props.data.pre
    this.state.post = props.data.post
  }

  changePre = action((event) => {
    this.props.data.pre = event.target.value
  })

  changePost = action((event) => {
    this.props.data.post = event.target.value
  })

  changeValue = action((event) => {
    const { data } = this.props
    const { target } = event
    const value = data.type === 'bool' ? target.checked : target.value
    if (data.type === 'number') {
      data.value = Number(value)
    } else if (data.type === 'bool') {
      if (value === 'true') {
        data.value = true
      } else if (value === 'false') {
        data.value = false
      } else {
        data.value = Boolean(value)
      }
    } else {
      data.value = value
    }
  })

  changeType = action((event) => {
    const { data } = this.props
    data.type = event.target.value
    if (data.type === 'number') {
      data.value = Number(data.value)
    } else if (data.type === 'bool') {
      if (rawValue === 'true') {
        data.value = true
      } else if (rawValue === 'false') {
        data.value = false
      } else {
        data.value = Boolean(rawValue)
      }
    }
  })

  handleFileChange = action((event) => {
    for (let i = 0; i < event.target.files.length; ++i) {
      const reader = new FileReader()
      reader.onload = (e) => {
        this.props.data.value = e.target.result
      }
      reader.readAsDataURL(event.target.files[i])
    }
  })

  cancel = action(() => {
    const { value, type, pre, post } = this.state
    const { data } = this.props
    data.value = value
    data.type = type
    data.pre = pre
    data.post = post
    this.props.handleClose()
  })

  submit = action((event) => {
    event.preventDefault()
    const { data } = this.props
    if (data.value === '[]') {
      data.value = []
    } else if (data.value === '{}') {
      data.value = {}
    }
    this.props.handleClose()
  })

  render() {
    let type
    const { data } = this.props
    if (data.type === 'number') {
      type = 'number'
    } else if (data.type === 'color') {
      type = 'color'
    } else if (this.state.type === 'file') {
      type = 'file'
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
              value={data.pre}
              onChange={this.changePre}
            />
            &nbsp;
            <TextField
              fullWidth
              label="post"
              value={data.post}
              onChange={this.changePost}
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
    const display = data.type === 'file' ? '' : data.value
    const valueView =
      data.type === 'bool' ? (
        <div>
          <Switch
            checked={data.value}
            onChange={this.changeValue}
            color="primary"
          />
          {data.value ? 'true' : 'false'}
        </div>
      ) : (
        <TextField
          fullWidth
          autoFocus
          label={this.props.name}
          type={type}
          style={style}
          defaultValue={display}
          onChange={this.changeValue}
        />
      )
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
        {fileView}
        {valueView}
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
