import React from 'react'
import { User } from '@freenit-framework/core'
import Template from 'templates/default/detail'

class UserDetail extends React.Component {
  render() {
    return (
      <Template secure style={{}}>
        <User.Detail {...this.props} />
      </Template>
    )
  }
}

export default UserDetail
