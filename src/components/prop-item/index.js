import React from 'react'
import PropTypes from 'prop-types'

import styles from './styles'


class PropItem extends React.Component {
  render() {
    const { data } = this.props
    if (data.children) { // object
      return (
        <div style={styles.item}>
          <span>{data.name}: &#123;</span>
          <div>
            {data.children.map(
              item => <PropItem data={item} key={item.identity} />
            )}
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
            {data.value.map(
              item => <PropItem key={item.identity} data={item} />
            )}
            <span>&#93;</span>
          </div>
        )
      }
      // simple value
      if (data.name) {
        return (
          <div style={styles.item}>
            <span>{data.name}: &nbsp;</span>
            <span>{data.value}</span>
          </div>
        )
      }
      return <div style={styles.item}>{data.value}</div>
    }
    return null
  }
}


PropItem.propTypes = {
  data: PropTypes.shape({}).isRequired,
}


export default PropItem
