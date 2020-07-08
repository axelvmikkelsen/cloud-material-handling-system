import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from 'react-router-dom';

import Dashboard from './dashboard/pages/Dashboard';
import CreateJob from './job/pages/CreateJob';
import Navigation from './shared/components/Navigation/Navigation';

const App = () => {

  return (
    <Router>
      <Navigation />
      <main>
        <Switch>
          <Route path="/" exact>
            <Dashboard />
          </Route>
          <Route path="/jobs/new" exact>
            <CreateJob />
          </Route>
          <Redirect to ="/" />
        </Switch>
      </main>
    </Router>
  );
};

export default App;
