import React from 'react'
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles'
import { Button } from '@material-ui/core'
import { withStore } from 'freenit'
import { toProps, DnD } from 'components'


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
    try {
      themeData = createMuiTheme(this.props.themeData)
    } catch (error) {
      themeData = {}
    }
    return (
      <ThemeProvider theme={themeData}>
        <DnD data={this.props.data} />
      </ThemeProvider>
    )
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
    const { theme, tree } = this.props.store.design
    const data = toProps(theme)
    return <Renderer data={tree} themeData={data} />
  }
}

export default withStore(Display)
