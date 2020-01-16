import React from 'react'
import PropTypes from 'prop-types'
import { withStore } from 'freenit'
import {
  TextField,
} from '@material-ui/core'

import styles from './styles'


class PropItem extends React.Component {
  state = {
    value: null,
  }

  handleValue = (identity, value) => () => {
    this.setState({ value })
    this.props.store.design.setEditing({
      identity,
      type: 'value',
    })
  }

  handleValueChange = (event) => {
    this.setState({ value: event.target.value })
  }

  handleSubmit = (event) => {
    event.preventDefault()
    this.props.store.design.setPropValue(this.state.value)
  }

  render() {
    const { data } = this.props
    const { editing } = this.props.store.design
    if (data.children) { // object
      return (
        <div style={styles.item}>
          <span>{data.name}: &#123;</span>
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
        return (
          <div key={data.identity} style={styles.item}>
            <span>{data.name}: &#91;</span>
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
      const editingThis = editing.identity === data.identity
      if (data.name) {
        if (editingThis) {
          return (
            <div style={styles.item}>
              <span>{data.name}: &nbsp;</span>
              <form onSubmit={this.handleSubmit}>
                <TextField
                  autoFocus
                  style={styles.item}
                  value={this.state.value}
                  onChange={this.handleValueChange}
                />
              </form>
            </div>
          )
        } else {
          return (
            <div style={styles.item}>
              <span>{data.name}: &nbsp;</span>
              <span onClick={this.handleValue(data.identity, data.value)}>
                {data.value}
              </span>
            </div>
          )
        }
      }
      if (editingThis) {
        return (
          <form onSubmit={this.handleSubmit}>
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
            onClick={this.handleValue(data.identity, data.value)}
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
