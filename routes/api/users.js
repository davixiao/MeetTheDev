const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

// GET is the request type. api/users is the endpoint.
// routing: how to respond to a request to a particular end point.
// So, if a client uses an http GET request to api/users, how does our server
// respond?

// @route   POST api/users
// @desc    Register user
// @access  Public

// express-validator has middlewares that we can use to check the body.
// they can be included as second parameters.
router.post(
  '/',
  [
    // in newer versions, we don't need the [] anymore. I'll keep it cause it looks clean
    check('name', 'Name is required').not().isEmpty(), // theirs forgets to check if it is empty so we have to do it ourselves
    check('email', 'Please include a valid email').isEmail(), // their email checks if it is empty, so we don't have to do it
    check(
      'password',
      'Please enter password with 6 or more characters'
    ).isLength({ min: 6 }),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() }); // 400 is bad request
    }
    res.send('User route');
  }
);

module.exports = router;
