import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from 'react-router-dom';

import Dashboard from './dashboard/pages/Dashboard';
import CreateJob from './create/CreateJob';
import CreateTag from './create/CreateTag';
import Footer from './shared/components/UIElements/Footer';
import Navigation from './shared/components/Navigation/Navigation';
import Auth from './auth/pages/Auth';

import { AuthContext } from './shared/context/auth-context';
import { useAuth } from './shared/hooks/auth-hook';

const App = () => {
  const { token, login, logout, userId } = useAuth();

  let routes

  if (token) {
    routes = (
      <Switch>
        <Route path="/create/job" exact>
          <CreateJob />
        </Route>
        <Route path="/create/tag" exact>
          <CreateTag />
        </Route>
        <Route path="/dashboard" exact>
          <Dashboard />
        </Route>
        <Redirect to="/dashboard" />
      </Switch>
    );
  } else {
    routes = (
          <Auth />
    );
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        token: token,
        userId: userId,
        login: login,
        logout: logout,
      }}
    >
      <Router>
        <Navigation />
        <main>{routes}</main>
      </Router>
      <Footer />
    </AuthContext.Provider>
  );
};

export default App;
