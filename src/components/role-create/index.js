import React from 'react'
import PropTypes from 'prop-types'
import { withStore } from 'freenit'

// Components
import {
  Button,
  Dialog,
  DialogTitle,
  TextField,
} from '@material-ui/core'

import styles from './styles'


class RoleCreate extends React.Component {
  state = {
    name: '',
  }

  handleName = (event) => {
    this.setState({ name: event.target.value })
  }

  handleSubmit = async (event) => {
    event.preventDefault()
    const { name } = this.state
    const { role, notification } = this.props.store
    const response = await role.create({ name })
    if (response.ok) {
      notification.show('Role created')
    } else {
      notification.show('Error')
    }
    this.props.close()
  }

  render() {
    return (
      <Dialog
        onClose={this.props.close}
        open={this.props.open}
      >
        <DialogTitle>Create new role</DialogTitle>
        <form onSubmit={this.handleSubmit} style={styles.form}>
          <TextField
            autoFocus
            required
            fullWidth
            label="Name"
            variant="outlined"
            value={this.state.name}
            onChange={this.handleName}
          />
          <Button
            fullWidth
            type="submit"
            color="primary"
            variant="contained"
          >
            Create
          </Button>
          <Button
            fullWidth
            color="secondary"
            variant="outlined"
            onClick={this.props.close}
          >
            Cancel
          </Button>
        </form>
      </Dialog>
    )
  }
}


RoleCreate.propTypes = {
  open: PropTypes.bool,
  close: PropTypes.func.isRequired,
}


export default withStore(RoleCreate)
