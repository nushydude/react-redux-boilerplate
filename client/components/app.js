import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';

import Dashboard from './dashboard';
import Header from './header';
import Login from './auth/login';
import Logoff from './auth/logoff';
import NotFound from './not_found';
import Register from './auth/register';
import RequireAuth from './auth/require_auth';
import Welcome from './welcome';

export default class App extends Component {
  render() {
    return (
      <div>
        <Header title="React-Redux Boilerplate" />
        <Switch>
          <Route exact path='/' component={Welcome} />
          <Route path='/login' component={Login} />
          <Route path='/logoff' component={Logoff} />
          <Route path='/register' component={Register} />
          <Route path='/dashboard' component={RequireAuth(Dashboard)} />
          <Route component={NotFound} />
        </Switch>
      </div>
    );
  }
}
