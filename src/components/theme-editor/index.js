import React from 'react'
import { withStore } from 'freenit'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@material-ui/core'
import {
  convert,
  PropItem,
} from 'components'
// import styles from './styles'



class ThemeEditor extends React.Component {
  state = {
    add: null,
    name: '',
    value: '',
  }

  showAdd = (identity) => () => {
    this.setState({ add: identity })
  }

  closeAdd = () => {
    this.setState({ add: null })
  }

  addProp = () => {
    const { add, name, value } = this.state
    this.props.store.design.addThemeProp(
      add,
      name,
      value === '{}' ? convert('value', {}) : value,
    )
    this.setState({ name: '', value: '', add: null })
  }

  handleNewName = (event) => {
    this.setState({ name: event.target.value })
  }

  handleNewValue = (event) => {
    this.setState({ value: event.target.value })
  }

  render() {
    return (
      <div>
        <PropItem
          flavor="theme"
          onAdd={this.showAdd}
          data={this.props.store.design.theme}
        />
        <Dialog open={this.state.add !== null} onClose={this.closeAdd}>
          <DialogTitle>Add new property</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              label="name"
              value={this.state.name}
              onChange={this.handleNewName}
            />
            <TextField
              label="value"
              value={this.state.value}
              onChange={this.handleNewValue}
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={this.addProp}
              variant="outlined"
            >
              Add
            </Button>
            <Button
              onClick={this.closeAdd}
              variant="outlined"
            >
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    )
  }
}


export default withStore(ThemeEditor)
