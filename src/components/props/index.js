import React from 'react'
import PropTypes from 'prop-types'
import { withStore } from 'freenit'

import styles from './styles'


class Props extends React.Component {
  render() {
    const data = this.props.store.design.selected.props || {}
    const propDisplay = Object.getOwnPropertyNames(data).map(prop => {
      let dataToDisplay
      if (typeof data[prop] === 'object') {
        dataToDisplay = `${prop}: {}`
      } else {
        dataToDisplay = `${prop}: ${data[prop]}`
      }
      return (
        <div key={prop}>
          {dataToDisplay}
        </div>
      )
    })
    return (
      <div style={styles.root}>
        Props
        {propDisplay}
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
