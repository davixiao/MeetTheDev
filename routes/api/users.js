const express = require('express');
const router = express.Router();

// GET is the request type. api/users is the endpoint.
// routing: how to respond to a request to a particular end point.
// So, if a client uses an http GET request to api/users, how does our server
// respond?

// @route   GET api/users
// @desc    test route
// @access  public
router.get('/', (req, res) => res.send('User route'));

module.exports = router;
