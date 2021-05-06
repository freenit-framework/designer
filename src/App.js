import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { ThemeProvider } from '@material-ui/styles'
import { Style } from 'radium'
import { StoreContext, StoreProvider } from '@freenit-framework/core'

import store from 'store'
import Routing from 'routing'
import theme from 'theme'
import styles from 'styles'

const App = () => {
  store.auth.init('/api/v0')
  return (
    <ThemeProvider theme={theme}>
      <Style rules={styles} />
      <Router>
        <StoreProvider store={store} />
        <StoreContext.Provider value={store}>
          <Routing />
        </StoreContext.Provider>
      </Router>
    </ThemeProvider>
  )
}

export default App
