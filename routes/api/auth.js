const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');

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

module.exports = router;
