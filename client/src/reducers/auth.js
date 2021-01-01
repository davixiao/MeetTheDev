import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
} from '../actions/types';

const initialState = {
  token: localStorage.getItem('token'),
  isAuthenticated: null,
  loading: true, // make sure loading is done - that we have heard back from the server
  user: null, // backend returns user with name, avatar, etc. This contains main data
};

export default function (state = initialState, { type, payload }) {
  switch (type) {
    case USER_LOADED:
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        user: payload, // contains name, email, avatar, etc.
      };
    case REGISTER_SUCCESS:
      //localStorage.setItem('token', payload.token);
      return {
        ...state,
        ...payload,
        isAuthenticated: true,
        loading: false, // we've gotten the response, so it is false that we are still loading
      };
    case AUTH_ERROR:
    case REGISTER_FAIL:
      //localStorage.removeItem('token');
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false, // we've gotten the response, so it is false that we are still loading
      };
    default:
      return state;
  }
}
