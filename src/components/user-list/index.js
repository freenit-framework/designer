import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { withStore } from 'freenit'

// Components
import {
  Badge,
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
} from '@material-ui/core'

import styles from './styles'


class UserList extends React.Component {
  constructor(props) {
    super(props)
    props.store.user.fetchAll()
  }

  render() {
    return (
      <Badge
        color="primary"
        badgeContent={this.props.store.user.list.total}
      >
        <Card style={styles.card}>
          <CardContent>
            <Typography variant="h5" data-id="users">
              Users
            </Typography>
            <Typography color="textSecondary">
              All users
            </Typography>
          </CardContent>
          <CardActions>
            <Link to="/users">
              <Button variant="outlined" size="small">Explore</Button>
            </Link>
          </CardActions>
        </Card>
      </Badge>
    )
  }
}


UserList.propTypes = {
  store: PropTypes.shape({
    user: PropTypes.shape({
      list: PropTypes.shape({
        total: PropTypes.number.isRequired,
      }).isRequired,
      fetchAll: PropTypes.func.isRequired,
    }).isRequired
  }).isRequired
}


export default withStore(UserList)
