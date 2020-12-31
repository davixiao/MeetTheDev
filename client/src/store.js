import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import rootReducer from './reducers'; // actually /reducers/index.js, but it knows it is index js.

const initialState = {};

const store = createStore(
  rootReducer,
  initialState,
  composeWithDevTools(applyMiddleware(thunk)) // note applyMiddleware can take a list of middlewares.
); // note composeWithDevTools can be replaced with just redux's compose function.
// However, it is good practice to use the devtools.

export default store;
