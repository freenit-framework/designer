import React from 'react'
// import PropTypes from 'prop-types'
import { DndProvider } from 'react-dnd'
import Backend from 'react-dnd-html5-backend'
import KeyHandler, { KEYPRESS } from 'react-key-handler'
import {
  Component,
  DnD,
} from 'components'

import styles from './styles'


const root = {
  component: 'div',
  key: Math.random(),
  children: [],
}


class Landing extends React.Component {
  state = {
    selected: {},
    tree: {
      ...root,
      props: {
        onMouseEnter: () => this.handleHover(root.key),
        onMouseLeave: () => this.handleHover(null),
        onClick: (event) => {
          event.stopPropagation()
          this.handleSelect(root)
        }
      }
    },
    hover: null,
  }

  handleAdd = (item) => {
    const tree = { ...this.state.tree }
    const key = Math.random()
    const newitem = {
      ...item,
      key,
      children: [],
    }
    tree.children.push(newitem)
    this.setState({ tree, selected: newitem })
  }

  handleHover = (hover) => {
    this.setState({ hover })
  }

  handleSelect = (selected) => {
    this.setState({ selected })
  }

  removeComponent = (tree, key) => {
    const newtree = { ...tree }
    newtree.children = newtree.children.filter(
      component => component.key !== key,
    )
    newtree.children = newtree.children.map(
      component => this.removeComponent(component, key),
    )
    return newtree
  }

  handleKeyboard = (event) => {
    if (!this.state.selected) {
      return
    }
    if (!this.state.selected.key) {
      return
    }
    const { key } = this.state.selected
    if (key === root.key) {
      return
    }
    const tree = this.removeComponent(this.state.tree, key)
    this.setState({ tree })
  }

  render() {
    return (
      <DndProvider backend={Backend}>
        <KeyHandler
          keyEventName={KEYPRESS}
          keyValue="Delete"
          onKeyHandle={this.handleKeyboard}
        />
        <div style={styles.root}>
          <div style={styles.components}>
            <Component
              name="AppBar"
              add={this.handleAdd}
              hover={this.handleHover}
              select={this.select}
            />
            <Component
              name="Paper"
              add={this.handleAdd}
              hover={this.handleHover}
              select={this.select}
            />
          </div>
          <DnD
            hover={this.state.hover}
            selected={this.state.selected}
            tree={this.state.tree}
            onHover={this.handleHover}
            onSelect={this.handleSelect}
          />
          <div style={styles.tree} onKeyDown={this.handleKeyboard}>
            tree
          </div>
        </div>
      </DndProvider>
    )
  }
}


Landing.propTypes = {
  // theme: PropTypes.shape({}).isRequired,
}


export default Landing
