import React from 'react'
import { Switch, Route } from 'react-router-dom'

// Pages
import {
  Auth,
  Me,
  NoPage,
  Role,
  User,
} from 'freenit'
import Dashboard from 'pages/dashboard'
import Landing from 'pages/landing'


const Routing = () => {
  return (
    <Switch>
      <Route exact path="/" component={Landing.detail} />
      <Route exact path="/dashboard" component={Dashboard.detail} />
      <Route exact path="/event/:year" component={Event.detail} />
      <Route exact path="/events" component={Event.list} />
      <Route exact path="/login" component={Auth.login} />
      <Route exact path="/me" component={Me.detail} />
      <Route exact path="/register" component={Auth.register} />
      <Route exact path="/reset" component={Auth.reset} />
      <Route exact path="/reset/:token" component={Auth.changePassword} />
      <Route exact path="/role/:id" component={Role.detail} />
      <Route exact path="/roles" component={Role.list} />
      <Route exact path="/roles/:page" component={Role.list} />
      <Route exact path="/user/:id" component={User.detail} />
      <Route exact path="/users" component={User.list} />
      <Route exact path="/users/:page" component={User.list} />
      <Route exact path="/:year" component={Landing.detail} />
      <Route path="*" component={NoPage} />
    </Switch>
  )
}


export default Routing
