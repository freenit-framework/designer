import React from 'react'
import { withStore } from 'freenit'
import DnD from 'components/dnd'
import {
  Tab,
  Tabs,
} from '@material-ui/core'
import styles from './styles'


class Display extends React.Component {
  state = {
    value: 0,
  }

  handleChange = (event, value) => {
    this.setState({ value })
  }

  render() {
    const { tree } = this.props.store.design
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
          <Tab label="Save" />
          <Tab label="Export" />
        </Tabs>
        <DnD data={tree} />
      </div>
    )
  }
}

export default withStore(Display)
