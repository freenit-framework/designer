import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withTheme } from '@material-ui/core/styles'
import {
  Button,
} from '@material-ui/core'
import { withStore } from 'freenit'
import getStyles from './styles'


class Landing extends Component {
  handleDesign = () => {
    this.props.store.history.push('/design')
  }

  render() {
    const height = this.props.height || 'calc(100vh - 64px - 40px)'
    const styles = getStyles(this.props.theme, height);
    return (
      <div style={styles.root}>
        <h1>
          Freenit Designer
        </h1>
        <div style={styles.small}>
          Design pages blazingly fast!
        </div>
        <Button style={styles.freenit} onClick={this.handleDesign}>
          Designs
        </Button>
      </div>
    )
  }
}


Landing.propTypes = {
  height: PropTypes.number,
  theme: PropTypes.shape({}).isRequired,
}


export default withTheme(withStore(Landing))
