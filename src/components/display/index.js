import React from 'react'
import { PhoneAndroid, Tablet, DesktopMac } from '@material-ui/icons'
import { Paper, IconButton } from '@material-ui/core'
import { withStore } from 'freenit'
import Renderer from "components/renderer"


class Display extends React.Component {
  setDisplay = (display) => () => {
    this.props.store.display.setDisplay(display)
  }

  render() {
    const { display, tree } = this.props.store
    return <>
      <Paper style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <IconButton onClick={this.setDisplay('mobile')}>
          <PhoneAndroid />
        </IconButton>
        <IconButton onClick={this.setDisplay('tablet')}>
          <Tablet />
        </IconButton>
        <IconButton onClick={this.setDisplay('desktop')}>
          <DesktopMac />
        </IconButton>
      </Paper>
      <Renderer
        data={tree.tree}
        store={this.props.store}
        type={display.display}
      />
    </>
  }
}

export default withStore(Display)
