import React from 'react'
import {
  TextField,
} from '@material-ui/core'
import { withStore } from 'freenit'

import {
  EditProp,
  PropItem,
} from 'components'
import styles from './styles'


class Props extends React.Component {
  state = {
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
      text: this.props.store.selected.selected.text || '<no value>',
    })
  }

  handleTextChange = (event) => {
    this.setState({ text: event.target.value })
  }

  handleSubmit = (event) => {
    event.preventDefault()
    const { selected, tree } = this.props.store
    if (this.state.text === '') {
      tree.setText(null, selected.selected)
    } else {
      tree.setText(this.state.text, selected.selected)
    }
    tree.setTree({ ...tree.tree })
    this.setState({ editing: false })
  }

  showEdit = (prop, identity) => () => {
    this.setState({ edit: prop, identity })
    this.props.store.editing.editing = prop
  }

  closeEdit = () => {
    this.setState({ edit: null })
    this.props.store.editing.editing = {}
  }

  render() {
    const { selected } = this.props.store.selected
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
      propView = (
        <EditProp
          data={this.state.edit}
          onClose={this.closeEdit}
          identity={this.state.identity}
        />
      )
    } else {
      propView = (
        <PropItem data={data} onEdit={this.showEdit} />
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
      </div>
    )
  }
}


Props.propTypes = {
}


export default withStore(Props)
