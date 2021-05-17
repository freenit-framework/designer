import React from 'react'
import { Link } from 'react-router-dom'
import { EmptyTemplate } from '@freenit-framework/core'
import store from 'store'

// Components
import {
  AppBar,
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
import LoginIcon from '@material-ui/icons/Input'
import LogoutIcon from '@material-ui/icons/PowerSettingsNew'
import ProfileIcon from '@material-ui/icons/AccountCircle'
import MenuIcon from '@material-ui/icons/Menu'
import RoleIcon from '@material-ui/icons/People'
import UserIcon from '@material-ui/icons/PeopleOutline'

import styles from './styles'

class Template extends React.Component {
  state = {
    showMenu: false,
  }

  handleLogout = async () => {
    const response = await store.auth.logout()
    if (response.ok) {
      store.history.push('/')
    }
  }

  handleMenuOpen = () => {
    this.setState({ showMenu: true })
  }

  handleMenuClose = () => {
    this.setState({ showMenu: false })
  }

  render() {
    const { auth, profile, resolution } = store
    const AnonButton = (
      <Link to="/login" style={styles.login}>
        <IconButton color="inherit">
          <LoginIcon />
        </IconButton>
      </Link>
    )
    const LoggedinButton = (
      <IconButton color="inherit" onClick={this.handleLogout}>
        <LogoutIcon />
      </IconButton>
    )
    const AuthButton = auth.authenticated() ? LoggedinButton : AnonButton
    const AdminMenu = profile.detail.admin
      ? [
          <Link to="/dashboard" key="dashboard">
            <MenuItem>
              <ListItemIcon>
                <DashboardIcon />
              </ListItemIcon>
              Dashboard
            </MenuItem>
          </Link>,
          <Link to="/users" key="users">
            <MenuItem>
              <ListItemIcon>
                <UserIcon />
              </ListItemIcon>
              Users
            </MenuItem>
          </Link>,
          <Link to="/roles" key="roles">
            <MenuItem>
              <ListItemIcon>
                <RoleIcon />
              </ListItemIcon>
              Roles
            </MenuItem>
          </Link>,
        ]
      : []
    const LoggingMenu = auth.authenticated() ? (
      <MenuItem onClick={this.handleLogout}>
        <ListItemIcon>
          <LogoutIcon />
        </ListItemIcon>
        Logout
      </MenuItem>
    ) : (
      <Link to="/login">
        <MenuItem>
          <ListItemIcon>
            <LoginIcon />
          </ListItemIcon>
          Login
        </MenuItem>
      </Link>
    )
    const AuthMenu = auth.authenticated()
      ? [
          <Link to="/profile" key="profile">
            <MenuItem>
              <ListItemIcon>
                <ProfileIcon />
              </ListItemIcon>
              Profile
            </MenuItem>
          </Link>,
          ...AdminMenu,
        ]
      : null
    const BarLinks = resolution.width > 410 ? <div>{AuthButton}</div> : null
    return (
      <div>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h5" color="inherit" style={styles.flex}>
              <IconButton color="inherit" onClick={this.handleMenuOpen}>
                <MenuIcon />
              </IconButton>
              <Link to="/" data-id="app">
                Freenit
              </Link>
            </Typography>
            {BarLinks}
          </Toolbar>
        </AppBar>
        <EmptyTemplate.Detail
          secure={this.props.secure}
          style={this.props.style}
        >
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
              {LoggingMenu}
            </div>
          </Drawer>
        </EmptyTemplate.Detail>
      </div>
    )
  }
}

export default Template
