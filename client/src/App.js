import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Landing } from './components/layout/Landing';
import { Register } from './components/auth/Register';
import { Login } from './components/auth/Login';

import './App.css';

const App = () => (
  <Router>
    <Navbar />
    {/* path is URI path. So, localhost:5000/register, etc */}
    {/* 
    switch is op. Without it, we would only be making a single page web page.
    YOOO THIS IS ACTUALLY EPIC. It's kind of like an If statement mixed with URI stuff.

    navbar stays the entire time. Using switch (like a switch statement), if it is /register,
    then add this route to the html. WOW
    */}
    <Route exact path='/' component={Landing} />
    <section className='container'>
      <Switch>
        <Route exact path='/register' component={Register} />
        <Route exact path='/login' component={Login} />
      </Switch>
    </section>
  </Router>
);

export default App;
