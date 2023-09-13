import React from 'react';
import ReactDom from 'react-dom';

import {
  HashRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import Login from './views/login';
import Registry from './views/registry';
import List from './views/list';

const App = () => {
  return (
    <Router>
      <Switch>
        <Route path="/login" key="login">
          <Login />
        </Route>
        <Route path="/registry" key="registry">
          <Registry />
        </Route>
        <Route path="/list" key="list">
          <List />
        </Route>
        <Route path="/">
          <div></div>
        </Route>
      </Switch>
    </Router>
  );
};

window.ReactDOM.render(
  <App />,
  document.getElementById('app')
);