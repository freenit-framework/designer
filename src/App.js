import React from 'react'
import StoreProvider from 'store/provider'
import { BrowserRouter as Router } from 'react-router-dom'
import { ThemeProvider } from '@material-ui/styles'
import { Style } from 'radium'

import Routing from 'routing'
import theme from 'theme'
import styles from 'styles'


export default () => {
  return (
    <ThemeProvider theme={theme}>
      <Style rules={styles} />
        <Router>
          <StoreProvider>
            <Routing />
          </StoreProvider>
        </Router>
    </ThemeProvider>
  )
}
