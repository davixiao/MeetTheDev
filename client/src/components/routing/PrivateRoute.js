import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

/*
render prop is what allows two react components to share code. 
Component with render prop takes a function (in this case, our function is (props) => ...)
that returns a React element. It then calls it instead of returning its own render logic.

In this case, we expect <Route /> to give us its own React elements. Instead, it 
either calls login, or the passed in Component, where the passed in Component takes in
the props that were supposed to go to <ROute />
*/

// the ...rest takes in the custom props for the specific Component
// then, the ...rest corresponds to the props in (props) and is passed into
// <Component />
const PrivateRoute = ({
  component: Component,
  auth: { isAuthenticated, loading },
  ...rest
}) => (
  <Route
    {...rest}
    render={(props) =>
      !isAuthenticated && !loading ? (
        <Redirect to='/login' />
      ) : (
        <Component {...props} />
      )
    }
  />
);

PrivateRoute.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(PrivateRoute);
