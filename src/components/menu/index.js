import React from 'react'
import PropTypes from 'prop-types'
import { withStore } from 'freenit'

import styles from './styles'


class Menu extends React.Component {
  render() {
    return (
      <div style={styles.root}>
        Menu
      </div>
    )
  }
}


Menu.propTypes = {
  store: PropTypes.shape({
    design: PropTypes.shape({}).isRequired,
  }).isRequired,
}


export default withStore(Menu)
