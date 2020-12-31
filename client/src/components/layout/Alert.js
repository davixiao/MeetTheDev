import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

/*
How it works:
1. no passwords match event happens in Register.js, and we call the action creator
2. Action creator generates action {msg, alert-type} and dispatches it
3. dispatching it calls the list of reducers which takes in the action and current state.
4. reducer checks if it is supposed to handle this type of action.
5. Reducer returns a new state
6. Alert.js component listens for state changes and outputs new states.
note that state is an array of objects, where each object is an alert
*/
// in javascript, boolean && expression will evaluate expression only when boolean is true.
// so if boolean is false, react skips it.
const Alert = ({ alerts }) =>
  alerts !== null &&
  alerts.length > 0 &&
  alerts.map((alert) => (
    <div key={alert.id} className={`alert alert-${alert.alertType}`}>
      {alert.msg}
    </div>
  ));

Alert.propTypes = {
  alerts: PropTypes.array.isRequired, // alerts reducer returns an array (which is new state)
};

// this grabs the alert reducer and puts it in prop as alerts for us.
const mapStateToProps = (state) => ({
  alerts: state.alert,
});

// puts alerts into props
export default connect(mapStateToProps)(Alert);
