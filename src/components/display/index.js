import React from 'react'
import { withStore } from 'freenit'
import {
  DnD ,
  Export,
  Save
} from 'components'
import {
  Tab,
  Tabs,
} from '@material-ui/core'
import styles from './styles'


class Renderer extends React.Component {
  state = {
    error: false,
  }

  static getDerivedStateFromError(error) {
    return { error: true }
  }

  componentDidCatch(error, errorInfo) {
    console.log('Renderer error', error, errorInfo)
  }

  render() {
    if (this.state.error) {
      return `Renderer error in render() ${this.props.data.identity}`
    }
    return <DnD data={this.props.data} />
  }
}


class Display extends React.Component {
  state = {
    value: 0,
  }

  handleChange = (event, value) => {
    this.setState({ value })
  }

  render() {
    const { tree } = this.props.store.design
    const { value } = this.state
    let display
    if (value === 0) {
      display = <Renderer data={tree} />
    } else if (value === 1) {
      display = <Save />
    } else if (value === 2) {
      display = <Export />
    }
    return (
      <div style={styles.root}>
        <Tabs
          value={this.state.value}
          indicatorColor="primary"
          textColor="primary"
          onChange={this.handleChange}
          variant="fullWidth"
          style={styles.tabs}
        >
          <Tab label="Design" />
          <Tab label="Save / Load" />
          <Tab label="Export" />
        </Tabs>
        {display}
      </div>
    )
  }
}

export default withStore(Display)
