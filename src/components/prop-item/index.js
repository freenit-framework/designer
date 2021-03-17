import React from 'react'
import PropTypes from 'prop-types'
import { withStore } from 'freenit'
import AddIcon from '@material-ui/icons/Add'
import RemoveIcon from '@material-ui/icons/Remove'
import {
  Button,
  TextField,
} from '@material-ui/core'

import styles from './styles'


class PropItem extends React.Component {
  state = {
    edit: false,
    name: '',
  }

  setOver = (data) => () => { this.props.store.over.over = data }

  removeItem = () => {
    const { editing, selected, theme, tree } = this.props.store
    if (this.props.flavor === 'props') {
      tree.removeProp(this.props.data, selected.selected.props)
    } else {
      theme.removeProp(this.props.data)
    }
    editing.editing = {}
  }

  openEdit = () => {
    this.setState({ edit: true, name: this.props.data.name })
  }

  closeEdit = () => {
    this.setState({ edit: false, name: '' })
  }

  editName = (event) => {
    this.setState({ name: event.target.value })
  }

  submit = (event) => {
    event.preventDefault()
    if (this.props.flavor === 'theme') {
      const { theme } = this.props.store
      theme.setPropName(this.props.data, this.state.name)
    } else {
      const { editing, selected, tree } = this.props.store
      tree.setPropName(
        this.state.name,
        selected.selected,
        this.props.data.identity,
      )
      editing.editing = {}
    }
    this.closeEdit()
  }

  render() {
    const { data, store } = this.props
    const { over } = store.over
    const { tree } = store.tree
    const iconStyle = over.identity === data.identity
      ? { opacity: 0.4 }
      : { opacity: 0 }
    if (this.state.edit) {
      return (
        <form onSubmit={this.submit}>
          <TextField
            autoFocus
            label="name"
            value={this.state.name}
            onChange={this.editName}
          />
          <div style={styles.buttons}>
            <Button variant="outlined" type="submit">
              OK
            </Button>
            <Button variant="outlined" onClick={this.closeEdit}>
              Cancel
            </Button>
          </div>
        </form>
      )
    } else {
      let nameComponent
      if (data.children) { // object
        nameComponent = (
          <span
            style={styles.prop.name}
            onMouseEnter={this.setOver(data)}
            onMouseLeave={this.setOver({})}
          >
            <span onClick={this.openEdit}>
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
      if (data.type === 'file') {
        nameComponent = (
          <span
            style={styles.prop.name}
            onMouseEnter={this.setOver(data)}
            onMouseLeave={this.setOver({})}
          >
            <span onClick={this.openEdit}>
              {data.name}:
            </span>
            &nbsp;
            <span onClick={this.props.onEdit(data)}>
              {data.pre}{'<file>'}{data.post}
            </span>
            <RemoveIcon style={iconStyle} onClick={this.removeItem} />
          </span>
        )
        return (
          <div style={styles.item}>
            {nameComponent}
          </div>
        )
      } else if (data.value) { // simple value or array
        if (Array.isArray(data.value)) { // array
          nameComponent = (
            <span
              style={styles.prop.name}
              onMouseEnter={this.setOver(data)}
              onMouseLeave={this.setOver({})}
            >
              <span onClick={this.openEdit}>
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
              onClick={this.openEdit}
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
