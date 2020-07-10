import React from 'react'
import PropTypes from 'prop-types'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@material-ui/core'
import { withStore } from 'freenit'

import {
  convert,
  EditProp,
  PropItem,
} from 'components'
import styles from './styles'


class Props extends React.Component {
  state = {
    add: null,
    edit: null,
    editing: false,
    over: false,
    text: '',
  }

  handleFocus = (event) => {
    event.target.select()
  }

  handleText = () => {
    this.setState({
      editing: true,
      text: this.props.store.design.selected.text || '<no value>',
    })
  }

  handleTextChange = (event) => {
    this.setState({ text: event.target.value })
  }

  handleSubmit = (event) => {
    event.preventDefault()
    const { setText } = this.props.store.design
    if (this.state.text === '') {
      setText(null)
    } else {
      setText(this.state.text)
    }
    this.setState({ editing: false })
  }

  showAdd = (identity) => () => {
    this.setState({ add: identity })
  }

  closeAdd = () => {
    this.setState({ add: null })
  }

  showEdit = (prop) => () => {
    this.setState({ edit: prop })
    this.props.store.design.setEditing(prop)
  }

  closeEdit = () => {
    this.setState({ edit: null })
    this.props.store.design.setEditing({})
  }

  addProp = () => {
    const { add, name, value } = this.state
    this.props.store.design.addProp(
      add,
      name,
      value === '{}' ? convert('value', {}) : value,
    )
    this.setState({ name: '', value: '', add: null })
  }

  editName = (event) => {
    this.setState({ name: event.target.value })
  }

  editValue = (event) => {
    this.setState({ value: event.target.value })
  }

  render() {
    const { selected } = this.props.store.design
    const data = selected.props || {}
    const text = selected.text || '<no value>'
    const textComponent = this.state.editing
      ? (
        <form onSubmit={this.handleSubmit}>
          <TextField
            autoFocus
            style={styles.text}
            value={this.state.text}
            onChange={this.handleTextChange}
            onFocus={this.handleFocus}
          />
        </form>
      ) : <span onClick={this.handleText}>{text}</span>
    let propView
    if (this.state.edit) {
      propView = <EditProp data={this.state.edit} onClose={this.closeEdit} />
    } else if (this.state.add) {
      propView = <div>add</div>
    } else {
      propView = (
        <PropItem data={data} onAdd={this.showAdd} onEdit={this.showEdit} />
      )
    }
    return (
      <div style={styles.root}>
        {propView}
        {selected.identity
          ? (
            <div style={styles.text}>
              <span>text: &nbsp;</span>
              {textComponent}
            </div>
          )
          : null
        }
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


Props.propTypes = {
  store: PropTypes.shape({
    design: PropTypes.shape({}).isRequired,
  }).isRequired,
}


export default withStore(Props)
