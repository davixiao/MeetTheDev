import { v4 as uuidv4 } from 'uuid';
import { SET_ALERT, REMOVE_ALERT } from './types';
// note we can use thunk and dispatch without import because they were provided in store
// if you look in App.js and the Provider.

// this means that setAlert returns another function
// setAlert takes in msg,alertType, and returns another function that takes in
// a dispatch function as its parameter.

// we can do this because of thunk middleware
// thunk intercepts every time store.dispatch is called and checks
// if the return is the expected object {type, payload }.
// If it is an object, just dispatch as normal. If it is a function,
// thunk calls that function and passes in the store.dispatch as the argument.

// so what I think is, when we first call setAlert with msg and alertType, it returns a function.
// Thunk sees that it is a function and passes store.dispatch to it.
// finally, it calls store.dispatch and thunk sees it and returns it as normal.

// What is the purpose of all this? Promises. Redux is synchronus, so what happens
// when we want async? basically, in between the two function calls, thunk waits
// to receive the response before calling the sync dispatch.

/*
function incrementAsync() {
  return (dispatch) => {
    setTimeout(() => {
      // Yay! Can invoke sync or async actions with `dispatch`
      dispatch(increment());
    }, 1000);
  };
}
*/
export const setAlert = (msg, alertType) => (dispatch) => {
  const id = uuidv4();
  // dispatching it sends it to the reducer
  dispatch({
    type: SET_ALERT,
    payload: { msg, alertType, id },
  });

  setTimeout(() => dispatch({ type: REMOVE_ALERT, payload: id }), 5000);
};
