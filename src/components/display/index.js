import React from 'react'
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles'
import { PhoneAndroid, Tablet, DesktopMac } from '@material-ui/icons'
import { Button, Paper, IconButton } from '@material-ui/core'
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
    const data = toProps(this.props.store.theme.theme || {})
    try {
      themeData = createMuiTheme(data)
    } catch (error) {
      themeData = {}
    }

    let resolution;
    switch (this.props.type) {
      case 'mobile':
        resolution = {
          width: '375px',
          height: '667px',
          maxHeight: '667px',
          overflowY: 'scroll',
          backgroundColor: '#fff',
          alignSelf: 'center'
        }
        break;

      case 'tablet':
        resolution = {
          display: 'block',
          width: '960px',
          height: '600px',
          maxHeight: '600px',
          overflowY: 'scroll',
          backgroundColor: '#fff',
          alignSelf: 'center'
        }
        break;

      default:
        resolution = {
          width: '100%',
          minHeight: 'calc(100vh - 37px)',
          backgroundColor: '#fff',
          alignSelf: 'top'
        }
        break;
    }
    return (
      <div style={{ display: 'flex', backgroundColor: '#eee', justifyContent: 'center', minHeight: 'calc(100vh - 37px)' }}>
        <div style={resolution}>
          <ThemeProvider theme={themeData} >
            <DnD data={this.props.data} />
          </ThemeProvider>
        </div>
      </div>
    )
  }
}


class Display extends React.Component {
  state = {
    value: 0,
    displayType: 'desktop'
  }

  handleChange = (event, value) => {
    this.setState({ value })
  }

  render() {
    const { tree } = this.props.store.tree
    return <>
      <Paper style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <IconButton onClick={() => this.setState({ displayType: 'mobile' })}>
          <PhoneAndroid />
        </IconButton>
        <IconButton onClick={() => this.setState({ displayType: 'tablet' })}>
          <Tablet />
        </IconButton>
        <IconButton onClick={() => this.setState({ displayType: 'desktop' })}>
          <DesktopMac />
        </IconButton>
      </Paper>
      <Renderer data={tree} store={this.props.store} type={this.state.displayType} />
    </>
  }
}

export default withStore(Display)
