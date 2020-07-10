import React from 'react'
import {
  Button,
  TextField,
} from '@material-ui/core'
import { withStore } from 'freenit'


class EditProp extends React.Component {
  constructor(props) {
    super(props)
    this.state = props.data
  }

  editName = (event) => {
    this.setState({ name: event.target.value })
  }

  editValue = (event) => {
    this.setState({ value: event.target.value })
  }

  submit = (event) => {
    event.preventDefault()
    const { design } = this.props.store
    design.setPropName(this.state.name)
    design.setPropValue(this.state.value)
    this.props.onClose()
  }

  render() {
    return (
      <form onSubmit={this.submit}>
        <div>
          <TextField
            autoFocus
            label="name"
            value={this.state.name}
            onChange={this.editName}
          />
          <TextField
            label="value"
            value={this.state.value}
            onChange={this.editValue}
          />
        </div>
        <div>
          <Button type="Submit">OK</Button>
          <Button onClick={this.props.onClose}>Cancel</Button>
        </div>
      </form>
    )
  }
}


EditProp.propTypes = {
}


export default withStore(EditProp)
