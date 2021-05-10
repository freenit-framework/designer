import React from 'react'
import { observer } from 'mobx-react'
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles'
import { Button } from '@material-ui/core'
import store from 'store'
import { toProps, DnD } from 'components'

const resolutions = {
  mobile: {
    width: '375px',
    height: '667px',
    maxHeight: '667px',
    overflowY: 'scroll',
    backgroundColor: '#fff',
    alignSelf: 'center',
  },

  tablet: {
    display: 'block',
    width: '960px',
    height: '600px',
    maxHeight: '600px',
    overflowY: 'scroll',
    backgroundColor: '#fff',
    alignSelf: 'center',
  },

  desktop: {
    width: '100%',
    minHeight: 'calc(100vh - 4px)',
    backgroundColor: '#fff',
    alignSelf: 'top',
  },
}
resolutions.default = resolutions.desktop

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

  resetErrors = () => {
    this.setState({ error: false })
  }

  render() {
    if (this.state.error) {
      return (
        <div>
          Renderer error in render() {this.props.data.identity}
          <div>
            <Button
              variant="contained"
              color="secondary"
              onClick={this.resetErrors}
            >
              Reset errors
            </Button>
          </div>
        </div>
      )
    }
    let themeData
    const data = toProps(store.theme.theme || {})
    try {
      themeData = createMuiTheme(data)
    } catch (error) {
      themeData = {}
    }
    const resolution = resolutions[this.props.type] || resolutions.desktop
    return (
      <div
        style={{
          display: 'flex',
          backgroundColor: '#eee',
          justifyContent: 'center',
          minHeight: 'calc(100vh - 4px)',
        }}
      >
        <div style={resolution}>
          <ThemeProvider theme={themeData}>
            <DnD data={this.props.data} />
          </ThemeProvider>
        </div>
      </div>
    )
  }
}

export default observer(Renderer)
