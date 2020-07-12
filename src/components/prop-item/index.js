import React from 'react'
import PropTypes from 'prop-types'
import { withStore } from 'freenit'
import AddIcon from '@material-ui/icons/Add'
import RemoveIcon from '@material-ui/icons/Remove'

import styles from './styles'


class PropItem extends React.Component {
  setOver = (data) => () => {
    this.props.store.design.setOver(data)
  }

  removeItem = () => {
    const { design } = this.props.store
    if (this.props.flavor === 'props') {
      design.removeProp(this.props.identity)
    } else {
      design.removeThemeProp(this.props.identity)
    }
  }

  render() {
    const { data, store } = this.props
    const { over, tree } = store.design
    const iconStyle = over.identity === data.identity
      ? { opacity: 0.4 }
      : { opacity: 0 }
    let nameComponent
    if (data.children) { // object
      nameComponent = (
        <span
          style={styles.prop.name}
          onMouseEnter={this.setOver(data)}
          onMouseLeave={this.setOver({})}
        >
          <span onClick={this.props.onEdit(data)}>
            {data.name}: &#123;
          </span>
          <div style={styles.item}>
            <AddIcon
              style={iconStyle}
              onClick={this.props.onEdit({}, data.identity)}
            />
            {data.identity !== tree.props.identity
              ? <RemoveIcon style={iconStyle} onClick={this.removeItem} />
              : null
            }
          </div>
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
                onEdit={this.props.onEdit}
                flavor={this.props.flavor}
              />
            ))}
          </div>
          <span>&#125;</span>
        </div>
      )
    }
    if (data.value) { // simple value or array
      if (Array.isArray(data.value)) { // array
        nameComponent = (
          <span
            style={styles.prop.name}
            onMouseEnter={this.setOver(data)}
            onMouseLeave={this.setOver({})}
          >
            <span onClick={this.props.onEdit(data)}>
              {data.name}: &#91;
            </span>
            <div style={styles.item}>
              <AddIcon
                style={iconStyle}
                onClick={this.props.onEdit({}, data.identity)}
              />
              <RemoveIcon style={iconStyle} onClick={this.removeItem} />
            </div>
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
                onEdit={this.props.onEdit}
                flavor={this.props.flavor}
              />
            ))}
            <span>&#93;</span>
          </div>
        )
      }
    }
    if (data.name) {
      return (
        <div style={styles.item}>
          <span
            onMouseEnter={this.setOver(data)}
            onMouseLeave={this.setOver({})}
            onClick={this.props.onEdit(data)}
          >
            {data.name}: &nbsp;
          </span>
          <span
            style={{ ...styles.prop.name, display: 'inline-flex' }}
            onMouseEnter={this.setOver(data)}
            onMouseLeave={this.setOver({})}
          >
            <span onClick={this.props.onEdit(data)}>
              {data.value}
            </span>
            <div style={styles.item}>
              <RemoveIcon style={iconStyle} onClick={this.removeItem} />
            </div>
          </span>
        </div>
      )
    }
    return null
  }
}


PropItem.propTypes = {
  data: PropTypes.shape({}).isRequired,
  flavor: PropTypes.string.isRequired,
}


PropItem.defaultProps = {
  flavor: 'props',
}


export default withStore(PropItem)
