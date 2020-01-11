import React from 'react'
import PropTypes from 'prop-types'
import { withStore } from 'freenit'

import styles from './styles'


class Props extends React.Component {
  isSimpleType = (data) => {
    return typeof data === 'string' || typeof data === 'boolean' || typeof data === 'number'
  }

  props2Components = (data, name, level = 0) => {
    const style = { marginLeft: level * 5 }
    if (this.isSimpleType(data)) {
      return (
        <div style={style} key={name}>
          {`${name}: ${data}`}
        </div>
      )
    }
    if (Array.isArray(data)) {
      const children = data.map(
        prop => this.props2Components(data[prop], prop, level + 1),
      )
      return (
        <div style={style} key={name}>
          {`${name}: [`}
          {children}
          ]
        </div>
      )
    }
    if (typeof data === 'object') {
      const children = Object.getOwnPropertyNames(data).map(
        prop => this.props2Components(data[prop], prop, level + 1),
      )
      return (
        <div style={style} key={name}>
          {`${name}: {`}
          {children}
          }
        </div>
      )
    }
  }

  render() {
    const data = this.props.store.design.selected.props || {}
    return (
      <div style={styles.root}>
        Props
        <div>
          {this.props2Components(data, 'props')}
        </div>
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
