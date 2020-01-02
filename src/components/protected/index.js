import React from 'react'
import PropTypes from 'prop-types'
import { withStore } from 'freenit'
import { withRouter } from 'react-router'


class ProtectedComponent extends React.Component {
  async componentDidMount() {
    const { auth, me } = this.props.store
    const response = await auth.refresh()
    if (!response.ok) {
      if (this.props.secure) {
        this.props.history.push('/')
      }
    } else if (!me.detail.id) {
      me.fetch()
    }
  }

  render() {
    return null
  }
}


ProtectedComponent.propTypes = {
  history: PropTypes.shape({ push: PropTypes.func.isRequired }).isRequired,
  secure: PropTypes.bool,
  store: PropTypes.shape({
    auth: PropTypes.shape({
      refresh: PropTypes.func.isRequired,
    }),
    me: PropTypes.shape({
      fetch: PropTypes.func.isRequired,
    }),
  })
}


export default withRouter(withStore(ProtectedComponent))
