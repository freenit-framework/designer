import React from 'react'
import PropTypes from 'prop-types'
import { withStore } from 'freenit'
import {
  TextField,
} from '@material-ui/core'

import styles from './styles'


class PropItem extends React.Component {
  state = {
    name: null,
    value: null,
  }

  handleValue = (data) => () => {
    const { identity, value } = data
    this.setState({ value })
    this.props.store.design.setEditing({
      identity,
      type: 'value',
    })
  }

  handleName = (data) => () => {
    const { identity, name } = data
    this.setState({ name })
    this.props.store.design.setEditing({
      identity,
      type: 'name',
    })
  }

  handleNameChange = (event) => {
    this.setState({ name: event.target.value })
  }

  handleValueChange = (event) => {
    this.setState({ value: event.target.value })
  }

  handleSubmitName = (event) => {
    event.preventDefault()
    this.props.store.design.setPropName(this.state.name)
  }

  handleSubmitValue = (event) => {
    event.preventDefault()
    this.props.store.design.setPropValue(this.state.value)
  }

  render() {
    const { data } = this.props
    const { editing, tree } = this.props.store.design
    const editingThis = editing.identity === data.identity &&
                        editing.identity !== tree.props.identity
    if (data.children) { // object
      const nameComponent = editingThis && editing.type === 'name'
        ? (
          <form onSubmit={this.handleSubmitName}>
            <TextField
              autoFocus
              style={styles.item}
              value={this.state.name}
              onChange={this.handleNameChange}
            />
          </form>
        ) : (
          <span onClick={this.handleName(data)}>
            {data.name}: &nbsp;
          </span>
        )
      return (
        <div style={styles.item}>
          {nameComponent}
          <div>
            {data.children.map(item => (
              <PropItem
                data={item}
                store={this.props.store}
                key={item.identity}
              />
            ))}
          </div>
          <span>&#125;</span>
        </div>
      )
    }
    if (data.value) { // simple value or array
      if (Array.isArray(data.value)) { // array
        const nameComponent = editingThis && editing.type === 'name'
          ? (
            <form onSubmit={this.handleSubmitName}>
              <TextField
                autoFocus
                style={styles.item}
                value={this.state.name}
                onChange={this.handleNameChange}
              />
            </form>
          ) : (
            <span onClick={this.handleName(data)}>
              {data.name}: &#91;
            </span>
          )
        return (
          <div key={data.identity} style={styles.item}>
            {nameComponent}
            {data.value.map(item => (
              <PropItem
                store={this.props.store}
                key={item.identity}
                data={item}
              />
            ))}
            <span>&#93;</span>
          </div>
        )
      }
      // simple value
      if (data.name) {
        const nameComponent = editingThis && editing.type === 'name'
          ? (
            <form onSubmit={this.handleSubmitName}>
              <TextField
                autoFocus
                style={styles.item}
                value={this.state.name}
                onChange={this.handleNameChange}
              />
            </form>
          ) : (
            <span onClick={this.handleName(data)}>
              {data.name}: &nbsp;
            </span>
          )
        const valueComponent = editingThis && editing.type === 'value'
          ? (
            <form onSubmit={this.handleSubmitValue}>
              <TextField
                autoFocus
                style={styles.item}
                value={this.state.value}
                onChange={this.handleValueChange}
              />
            </form>
          ) : (
            <span onClick={this.handleValue(data)}>
              {data.value}
            </span>
          )
        return (
          <div style={styles.item}>
            {nameComponent}
            {valueComponent}
          </div>
        )
      }
      if (editingThis) {
        return (
          <form onSubmit={this.handleSubmitValue}>
            <TextField
              autoFocus
              style={styles.item}
              value={this.state.value}
              onChange={this.handleValueChange}
            />
          </form>
        )
      } else {
        return (
          <div
            style={styles.item}
            onClick={this.handleValue(data)}
          >
            {data.value}
          </div>
        )
      }
    }
    return null
  }
}


PropItem.propTypes = {
  data: PropTypes.shape({}).isRequired,
}


export default withStore(PropItem)
