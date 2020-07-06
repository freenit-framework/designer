import React from 'react'
import { withStore } from 'freenit'
import {
  convert,
  PropItem,
} from 'components'
// import styles from './styles'



class ThemeEditor extends React.Component {
  theme = {
    palette: {
    }
  }

  render() {
    const data = convert('theme', this.theme)
    return <PropItem data={data} />
  }
}

export default withStore(ThemeEditor)
