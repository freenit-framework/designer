import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withTheme } from '@material-ui/core/styles'
import {
  Paper,
} from '@material-ui/core'
import getStyles from './styles'
import Template from 'templates/default/detail'


class Landing extends Component {
  render() {
    const height = this.props.height || 'calc(100vh - 64px - 40px)'
    const styles = getStyles(this.props.theme, height);
    return (
      <Template style={{}}>
        <div style={styles.root}>
          <h1>
            Freenit Framework
          </h1>
          <div style={styles.small}>
            Startkit for fast React development
          </div>
          <Paper style={styles.freenit}>
            Freenit
          </Paper>
        </div>
      </Template>
    )
  }
}


Landing.propTypes = {
  height: PropTypes.number,
  theme: PropTypes.shape({}).isRequired,
}


export default withTheme(Landing)
