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
    pre: '',
    post: '',
  }

  fileInput = React.createRef()
  openFileBrowser = () => this.fileInput.current.click()

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
    this.props.data.value = event.target.value
  })

  changeType = action((event) => {
    this.props.data.type = event.target.value
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
        {fileView}
        <TextField
          fullWidth
          autoFocus
          style={style}
          type={type}
          label={this.props.name}
          value={display}
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
