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
import Landing from 'pages/landing'
import Design from 'pages/design'


const Routing = () => {
  return (
    <Switch>
      <Route exact path="/" component={Landing.detail} />
      <Route exact path="/design" component={Design.detail} />
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
      <Route path="*" component={NoPage.detail} />
    </Switch>
  )
}


export default Routing
