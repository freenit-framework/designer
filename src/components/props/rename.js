import React from 'react'
import { observer } from 'mobx-react'
import { Button, TextField } from '@material-ui/core'

class RenameProp extends React.Component {
  state = {
    name: '',
  }

  constructor(props) {
    super(props)
    this.state.name = props.name
  }

  changeName = (event) => this.setState({ name: event.target.value })

  cancel = () => this.props.handleClose()

  submit = (event) => {
    event.preventDefault()
    const { data, parent, name } = this.props
    delete parent.value[name]
    parent.value[this.state.name] = data
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
          fullWidth
          autoFocus
          required
          type={type}
          label={this.props.name}
          value={this.state.name}
          onChange={this.changeName}
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

export default observer(RenameProp)
