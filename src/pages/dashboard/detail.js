import React from 'react'
import { Paper } from '@material-ui/core'

import { RoleList, UserList } from '@freenit-framework/core'
import Template from 'templates/default/detail'

import styles from './styles'

class AdminDashboard extends React.Component {
  render() {
    return (
      <Template secure style={{}}>
        <Paper style={styles.root}>
          <UserList />
          <RoleList />
        </Paper>
      </Template>
    )
  }
}

export default AdminDashboard
