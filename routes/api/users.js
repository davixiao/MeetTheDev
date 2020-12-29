const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');

const User = require('../../models/User');

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
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() }); // 400 is bad request
    }

    const { name, email, password } = req.body;

    try {
      // check if registered user already exists. Mongoose provides findOne, that
      // is a promise that returns boolean whether they found one.
      let user = await User.findOne({ email }); // email: email

      if (user) {
        // we put it in an array since we want to stay consistent. We put errors
        // in an array before, so just do it here too.
        return res
          .status(400)
          .json({ errors: [{ msg: 'User already exists' }] });
      }

      // create an avatar for them
      const avatar = gravatar.url(email, {
        s: '200', // size
        r: 'pg', // rating
        d: 'mm', // default image. We could do 404 for no image
      });

      // create the user based on the new info
      user = new User({
        name,
        email,
        avatar,
        password,
      });

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      await user.save();

      // JWT allows us to authenticate a user. So, we know it is actually them.
      // So, once the user is logged in, they get a token that we, the server sign
      // with a secret key. With that token,
      // whenever they make a request with that token, we already know it is them,
      // and no need for their password/email again. We still have to check the
      // token that it is them, though.
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
