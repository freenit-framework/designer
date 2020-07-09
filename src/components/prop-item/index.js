import React from 'react'
import PropTypes from 'prop-types'
import { withStore } from 'freenit'
import { TextField } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import RemoveIcon from '@material-ui/icons/Remove'

import styles from './styles'


class PropItem extends React.Component {
  state = {
    name: null,
    value: null,
    open: false,
  }

  fileInput = React.createRef()

  handleValue = (data) => () => {
    const { identity, value } = data
    this.props.store.design.setEditing({
      identity,
      type: 'value',
    })
    if (this.props.store.design.rearranging) {
      this.fileInput.current.click()
      this.setState({ value: '' })
    } else {
      this.setState({ value })
    }
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

  handleFocus = (event) => {
    event.target.select()
  }

  handleSubmitName = (event) => {
    event.preventDefault()
    const { design } = this.props.store
    if (this.props.flavor === 'props') {
      design.setPropName(this.state.name)
    } else {
      design.setThemePropName(this.props.data.identity, this.state.name)
    }
  }

  handleSubmitValue = (event) => {
    event.preventDefault()
    const { design } = this.props.store
    if (this.props.flavor === 'props') {
      design.setPropValue(this.state.value)
    } else {
      design.setThemePropValue(this.props.data.identity, this.state.value)
    }
  }

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

  handleFileChange = (event) => {
    if (event.target.files.length > 0) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const { design } = this.props.store
        design.setPropValue(e.target.result, this.props.data.identity)
      }
      const [ file ] = event.target.files
      reader.readAsDataURL(file)
    }
  }

  render() {
    const fileHandler = <input
      ref={this.fileInput}
      type="file"
      style={styles.file}
      onChange={this.handleFileChange}
    />

    const { data } = this.props
    const { editing, over, tree } = this.props.store.design
    const editingThis = editing.identity === data.identity &&
                        editing.identity !== tree.props.identity
    const iconStyle = over.identity === data.identity
      ? { opacity: 0.4 }
      : { opacity: 0 }
    if (data.children) { // object
      const nameComponent = editingThis && editing.type === 'name'
        ? (
          <form onSubmit={this.handleSubmitName}>
            <TextField
              autoFocus
              style={styles.item}
              value={this.state.name}
              onChange={this.handleNameChange}
              onFocus={this.handleFocus}
            />
          </form>
        ) : (
          <span
            style={styles.prop.name}
            onMouseEnter={this.setOver(data)}
            onMouseLeave={this.setOver({})}
          >
            <span onClick={this.handleName(data)}>
              {data.name}: &#123;
            </span>
            <div style={styles.item}>
              <AddIcon
                style={iconStyle}
                onClick={this.props.onAdd(data.identity)}
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
          {fileHandler}
          {nameComponent}
          <div>
            {data.children.map(item => (
              <PropItem
                data={item}
                store={this.props.store}
                key={item.identity}
                onAdd={this.props.onAdd}
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
        const nameComponent = editingThis && editing.type === 'name'
          ? (
            <form onSubmit={this.handleSubmitName}>
              <TextField
                autoFocus
                style={styles.item}
                value={this.state.name}
                onChange={this.handleNameChange}
                onFocus={this.handleFocus}
              />
            </form>
          ) : (
            <span
              style={styles.prop.name}
              onMouseEnter={this.setOver(data)}
              onMouseLeave={this.setOver({})}
            >
              <span onClick={this.handleName(data)}>
                {data.name}: &#91;
              </span>
              <div style={styles.item}>
                <AddIcon
                  style={iconStyle}
                  onClick={this.props.onAdd(data.identity)}
                />
                <RemoveIcon style={iconStyle} onClick={this.removeItem} />
              </div>
            </span>
          )
        return (
          <div key={data.identity} style={styles.item}>
            {fileHandler}
            {nameComponent}
            {data.value.map(item => (
              <PropItem
                store={this.props.store}
                key={item.identity}
                data={item}
                onAdd={this.props.onAdd}
                flavor={this.props.flavor}
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
                onFocus={this.handleFocus}
              />
            </form>
          ) : (
            <span
              onClick={this.handleName(data)}
              onMouseEnter={this.setOver(data)}
              onMouseLeave={this.setOver({})}
            >
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
                onFocus={this.handleFocus}
              />
            </form>
          ) : (
            <span
              style={{ ...styles.prop.name, display: 'inline-flex' }}
              onMouseEnter={this.setOver(data)}
              onMouseLeave={this.setOver({})}
            >
              <span onClick={this.handleValue(data)}>
                {data.value}
              </span>
              <div style={styles.item}>
                <RemoveIcon style={iconStyle} onClick={this.removeItem} />
              </div>
            </span>
          )
        return (
          <div style={styles.item}>
            {fileHandler}
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
              onFocus={this.handleFocus}
            />
          </form>
        )
      } else {
        return (
          <div
            style={{
              ...styles.prop.name,
              ...styles.item,
            }}
            onMouseEnter={this.setOver(data)}
            onMouseLeave={this.setOver({})}
          >
            {fileHandler}
            <span onClick={this.handleValue(data)}>
              {data.value}
            </span>
            <div style={styles.item}>
              <RemoveIcon style={iconStyle} onClick={this.removeItem} />
            </div>
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
