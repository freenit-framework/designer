import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { withStore } from 'freenit'

// Components
import Badge from '@material-ui/core/Badge'
import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'

import styles from './styles'


class RoleList extends React.Component {
  constructor(props) {
    super(props)
    props.store.role.fetchAll()
  }

  render() {
    return (
      <Badge
        color="primary"
        badgeContent={this.props.store.role.list.total}
      >
        <Card style={styles.card}>
          <CardContent>
            <Typography variant="h5" data-id="roles">
              Roles
            </Typography>
            <Typography color="textSecondary">
              All roles
            </Typography>
          </CardContent>
          <CardActions>
            <Link to="/roles">
              <Button variant="outlined" size="small">Explore</Button>
            </Link>
          </CardActions>
        </Card>
      </Badge>
    )
  }
}


RoleList.propTypes = {
  store: PropTypes.shape({
    role: PropTypes.shape({
      list: PropTypes.shape({
        total: PropTypes.number.isRequired,
      }).isRequired,
      fetchAll: PropTypes.func.isRequired,
    }).isRequired
  }).isRequired
}


export default withStore(RoleList)
