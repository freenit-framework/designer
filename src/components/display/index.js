import React from 'react'
import { toJS } from 'mobx'
import { observer } from 'mobx-react'
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles'

import { KeyBind, Renderer } from 'components'
import store from 'store'
import { decompile } from 'utils'
import styles from './styles'

class Display extends React.Component {
  render() {
    let themeData
    const { device } = store.design
    const style = styles[device] || styles.default
    const theme = decompile(toJS(store.design.theme))
    try {
      themeData = createMuiTheme(theme)
    } catch (error) {
      themeData = {}
    }
    return (
      <ThemeProvider theme={themeData}>
        <div style={styles.root}>
          <div style={style}>
            <KeyBind>
              <Renderer data={store.design.tree} />
            </KeyBind>
          </div>
        </div>
      </ThemeProvider>
    )
  }
}

export default observer(Display)
