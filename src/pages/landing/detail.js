import React from 'react'
// import PropTypes from 'prop-types'
import { DndProvider } from 'react-dnd'
import Backend from 'react-dnd-html5-backend'
import {
  AppBar,
  Paper,
} from '@material-ui/core'
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
      props: {
        style: { backgroundColor: 'red' },
      },
      text: 'Neki text',
      children: [
        {
          component: Paper,
          key: Math.random(),
          props: {},
          children: [],
          text: 'This is SpaNta!!!',
        },
      ],
    },
  }

  handleAdd = (component) => {
    const tree = { ...this.state.tree }
    const key = Math.random()
    tree.children.push({
      key,
      component,
      props: {},
      children: [],
      text: 'Paper',
    })
    this.setState({ tree, selected: key })
  }

  render() {
    return (
      <DndProvider backend={Backend}>
        <div style={styles.root}>
          <div style={styles.components}>
            <Component
              name="AppBar"
              component={AppBar}
              handler={this.handleAdd}
            />
            <Component
              name="Paper"
              component={Paper}
              handler={this.handleAdd}
            />
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
