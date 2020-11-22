import React from 'react'
import { Switch, Route } from 'react-router-dom'

// Pages
import {
  NoPage,
  Profile,
} from 'freenit'
import {
  Landing,
  Design,
} from 'pages'


const Routing = () => {
  return (
    <Switch>
      <Route exact path="/" component={Landing.Detail} />
      <Route exact path="/design" component={Design.Detail} />
      <Route exact path="/profile" component={Profile.Detail} />
      <Route path="*" component={NoPage.Detail} />
    </Switch>
  )
}


export default Routing
