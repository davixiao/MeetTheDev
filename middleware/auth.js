const jwt = require('jsonwebtoken');
const config = require('config');

// so, once the user signs in, they get their token.
// whenever they make a new request during their logged in session,
// we get their token in the header of that request. Now we verify that
// it is that user.

// middleware is a function that has access
// to the req and res before we send it.
// next moves on to the next middleware function. We let them know they can move on.
module.exports = (req, res, next) => {
  // get token from header
  const token = req.header('x-auth-token');

  // check for no token
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  // verify token
  try {
    const decoded = jwt.verify(token, config.get('jwtSecret'));
    req.user = decoded.user; // jwt payload has user object with its id in database
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
