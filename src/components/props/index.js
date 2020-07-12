import React from 'react'
import PropTypes from 'prop-types'
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

  showEdit = (prop, identity) => () => {
    this.setState({ edit: prop, identity })
    this.props.store.design.setEditing(prop)
  }

  closeEdit = () => {
    this.setState({ edit: null })
    this.props.store.design.setEditing({})
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
  store: PropTypes.shape({
    design: PropTypes.shape({}).isRequired,
  }).isRequired,
}


export default withStore(Props)
