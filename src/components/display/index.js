import React from 'react'
import { withStore } from 'freenit'
import DnD from 'components/dnd'
import styles from './styles'


class Display extends React.Component {
  render() {
    const { tree } = this.props.store.design
    return (
      <div style={styles.root}>
        <DnD data={tree} />
      </div>
    )
  }
}

export default withStore(Display)
