import React from 'react'
// import PropTypes from 'prop-types'
import { DndProvider } from 'react-dnd'
import Backend from 'react-dnd-html5-backend'
import {
  Component,
  DnD,
} from 'components'

import styles from './styles'


class Landing extends React.Component {
  state = {
    selected: null,
    tree: {
      component: 'div',
      key: Math.random(),
      children: [],
    },
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
    this.setState({ tree, selected: key })
  }

  render() {
    return (
      <DndProvider backend={Backend}>
        <div style={styles.root}>
          <div style={styles.components}>
            <Component name="AppBar" handler={this.handleAdd} />
            <Component name="Paper" handler={this.handleAdd} />
          </div>
          <DnD tree={this.state.tree} />
          <div style={styles.tree}>
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
