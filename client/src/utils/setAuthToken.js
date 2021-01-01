import axios from 'axios';

// takes in the token from local storage
const setAuthToken = (token) => {
  // check if there is a token in local storage
  // we set a default header so that whenever we make a request, the token is in the header.
  // if it is not, then delete it from the headers (I assume that there won't be an issue
  // if we delete from null).
  if (token) {
    axios.defaults.headers.common['x-auth-token'] = token;
    localStorage.setItem('token', token);
  } else {
    delete axios.defaults.headers.common['x-auth-token'];
    localStorage.removeItem('token');
  }
};

export default setAuthToken;
