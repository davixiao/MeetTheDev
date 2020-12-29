const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');

const User = require('../../models/User');

// @route   GET api/auth
// @desc    test route
// @access  public
// whenever we wan to use middleware, add it like this.
router.get('/', auth, async (req, res) => {
  try {
    // in middleware, we decoded token and put it in req.user
    // -password means we don't want the password
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// existing user login

// @route POST api/auth
// @desc  authenticate user and get token
// @access public
router.post(
  '/',
  [
    // in newer versions, we don't need the [] anymore. I'll keep it cause it looks clean
    check('email', 'Please include a valid email').isEmail(), // their email checks if it is empty, so we don't have to do it
    check('password', 'Password is required').exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() }); // 400 is bad request
    }

    const { email, password } = req.body;

    try {
      // check if registered user already exists. Mongoose provides findOne, that
      // is a promise that returns boolean whether they found one.
      let user = await User.findOne({ email }); // email: email

      // we check if there is not a user.
      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid Credentials' }] });
      }

      // registered users have their password encrypted in database. Bcrypt lets us
      // compare encrypted password with password that was entered.
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid Credentials' }] });
      }

      const payload = {
        user: {
          id: user.id, // after saving, mongodb provides an _id, which mongoose simplifies to id
        },
      };

      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      ); // 1 hour is 3600 seconds. we add a few 0s for development
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

module.exports = router;
