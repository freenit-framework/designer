import React from 'react'
import { Switch, Route } from 'react-router-dom'

// Pages
import {
  NoPage,
  Profile,
} from 'freenit'
import Landing from 'pages/landing'
import Design from 'pages/design'


const Routing = () => {
  return (
    <Switch>
      <Route exact path="/" component={Landing.detail} />
      <Route exact path="/design" component={Design.detail} />
      <Route exact path="/profile" component={Profile.detail} />
      <Route path="*" component={NoPage.detail} />
    </Switch>
  )
}


export default Routing
