import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import Alert from './components/layout/Alert';
import Dashboard from './components/dashboard/Dashboard';
import PrivateRoute from './components/routing/PrivateRoute';
import CreateProfile from './components/profile-forms/CreateProfile';
import EditProfile from './components/profile-forms/EditProfile';

// Redux
import { Provider } from 'react-redux';
import store from './store';
import { loadUser } from './actions/auth';
import setAuthToken from './utils/setAuthToken';

import './App.css';

const App = () => {
  // useEffect tells React that this component (in this case, App) wants to do
  // something after a change in state (or render). React will remember the function
  // passed to useEffect and call it after performing DOM updates.
  // DOM updates include data fetching, calling API, changing stuff, etc.

  // add [] so it only runs once when state updates
  // use effect keeps running in a constant loop if we don't add [].
  useEffect(() => {
    if (localStorage.token) {
      setAuthToken(localStorage.token);
    }
    store.dispatch(loadUser());
  }, []);

  return (
    <Provider store={store}>
      <Router>
        <Navbar />
        {/* path is URI path. So, localhost:5000/register, etc */}
        {/* 
    switch is op. Without it, we would only be making a single page web page.
    It's kind of like an If statement mixed with URI stuff.

    navbar stays the entire time. Using switch (like a switch statement), if it is /register,
    then add this route to the html. 
    */}
        <Route exact path='/' component={Landing} />
        <section className='container'>
          <Alert />
          <Switch>
            <Route exact path='/register' component={Register} />
            <Route exact path='/login' component={Login} />
            {/* Stops people from just typing in /dashboard in URL without being logged in */}
            <PrivateRoute exact path='/dashboard' component={Dashboard} />
            <PrivateRoute
              exact
              path='/create-profile'
              component={CreateProfile}
            />
            <PrivateRoute exact path='/edit-profile' component={EditProfile} />
          </Switch>
        </section>
      </Router>
    </Provider>
  );
};

export default App;
