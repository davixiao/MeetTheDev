import { SET_ALERT, REMOVE_ALERT } from '../actions/types';

const initialState = [];

// action contains a type and a payload. (payload is optional, type is required)
// this reducer returns the previous state (...state) with something new (payload).
// note that state is an array, so we can use ...
const alertReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case SET_ALERT:
      return [...state, payload];
    case REMOVE_ALERT:
      return state.filter((alert) => alert.id !== payload);
    default:
      return state;
  }
};

export default alertReducer;
