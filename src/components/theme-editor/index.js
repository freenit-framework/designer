import React from 'react'
import { withStore } from 'freenit'
import {
  PropItem,
} from 'components'
// import styles from './styles'



class ThemeEditor extends React.Component {
  render() {
    return <PropItem data={this.props.store.design.theme} />
  }
}

export default withStore(ThemeEditor)
