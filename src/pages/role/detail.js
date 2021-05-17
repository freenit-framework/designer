import React from 'react'
import { Role } from '@freenit-framework/core'
import Template from 'templates/default/detail'

class RoleDetail extends React.Component {
  render() {
    return (
      <Template secure style={{}}>
        <Role.Detail {...this.props} />
      </Template>
    )
  }
}

export default RoleDetail
