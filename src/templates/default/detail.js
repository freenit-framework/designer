import React from 'react'
import PropTypes from 'prop-types'
import { Link, withRouter } from 'react-router-dom'
import {
  EmptyTemplate,
  withStore,
} from 'freenit'

// Components
import {
  AppBar,
  Button,
  Drawer,
  IconButton,
  ListItemIcon,
  MenuItem,
  Toolbar,
  Typography,
} from '@material-ui/core'

// Icons
import CloseIcon from '@material-ui/icons/Clear'
import DashboardIcon from '@material-ui/icons/Dashboard'
import MeIcon from '@material-ui/icons/AccountCircle'
import ReorderIcon from '@material-ui/icons/Reorder'
import UserIcon from '@material-ui/icons/PeopleOutline'
import RoleIcon from '@material-ui/icons/People'

import styles from './styles'


class Template extends React.Component {
  state = {
    showMenu: false,
  }

  handleLogout = async () => {
    const { auth  } = this.props.store
    const response = await auth.logout()
    if (response.ok === undefined) {
      this.props.history.push('/')
    }
  }

  handleMenuOpen = () => {
    this.setState({ showMenu: true })
  }

  handleMenuClose = () => {
    this.setState({ showMenu: false })
  }

  render() {
    const { auth  } = this.props.store
    const AnonButton = (
      <Link to="/login" style={styles.login}>
        <Button color="inherit">Login</Button>
      </Link>
    )
    const LoggedinButton = (
      <Button color="inherit" onClick={this.handleLogout}>
        Logout
      </Button>
    )
    const AuthButton = auth.detail.ok ? LoggedinButton : AnonButton
    const AuthMenu = auth.detail.ok
      ? [
        (
          <Link to="/dashboard" key="dashboard">
            <MenuItem>
              <ListItemIcon>
                <DashboardIcon />
              </ListItemIcon>
              Dashboard
            </MenuItem>
          </Link>
        ),
        (
          <Link to="/me" key="me">
            <MenuItem>
              <ListItemIcon>
                <MeIcon />
              </ListItemIcon>
              Me
            </MenuItem>
          </Link>
        ),
        (
          <Link to="/users" key="users">
            <MenuItem>
              <ListItemIcon>
                <UserIcon />
              </ListItemIcon>
              Users
            </MenuItem>
          </Link>
        ),
        (
          <Link to="/roles" key="roles">
            <MenuItem>
              <ListItemIcon>
                <RoleIcon />
              </ListItemIcon>
              Roles
            </MenuItem>
          </Link>
        ),
      ]
      : null
    return (
      <div>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h5" color="inherit" style={styles.flex}>
              <IconButton color="inherit" onClick={this.handleMenuOpen}>
                <ReorderIcon />
              </IconButton>
              <Link to="/" data-id="app">
                Freenit Designer
              </Link>
            </Typography>
            {AuthButton}
          </Toolbar>
        </AppBar>
        <EmptyTemplate.Detail secure={this.props.secure} style={this.props.style}>
          {this.props.children}
          <Drawer open={this.state.showMenu} onClose={this.handleMenuClose}>
            <AppBar position="static">
              <Toolbar>
                <Typography variant="h5" color="inherit" style={styles.flex}>
                  &nbsp;
                </Typography>
                <IconButton color="inherit" onClick={this.handleMenuClose}>
                  <CloseIcon />
                </IconButton>
              </Toolbar>
            </AppBar>
            <div
              role="button"
              onClick={this.handleMenuClose}
              style={styles.menu}
              tabIndex={0}
              onKeyDown={this.handleMenuClose}
            >
              {AuthMenu}
            </div>
          </Drawer>
        </EmptyTemplate.Detail>
      </div>
    )
  }
}


Template.propTypes = {
  children: PropTypes.node,
  history: PropTypes.shape({ push: PropTypes.func.isRequired }).isRequired,
  secure: PropTypes.bool,
  style: PropTypes.shape({}),
  title: PropTypes.string,
}


export default withRouter(withStore(Template))
