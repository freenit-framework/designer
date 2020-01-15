import React from 'react'
import PropTypes from 'prop-types'
import { withStore } from 'freenit'

import { PropItem } from 'components'
import styles from './styles'


class Props extends React.Component {
  render() {
    const data = this.props.store.design.selected.props || {}
    return (
      <div style={styles.root}>
        <PropItem data={data} />
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
