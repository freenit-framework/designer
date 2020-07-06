import React from 'react'
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles'
import { withStore } from 'freenit'
import { DnD } from 'components'


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
    const theme = createMuiTheme({
      // palette: {
        // primary: {
          // main: '#bbb',
        // }
      // }
    })
    return (
      <ThemeProvider theme={theme}>
        <Renderer data={tree} />
      </ThemeProvider>
    )
  }
}

export default withStore(Display)
