const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');

const User = require('../../models/User');
const Profile = require('../../models/Profile');

// Route to fetch profile from database
// use /me to get current user's profile.
// this is private since it requires a token. Not everyone can see this.
// @route   GET api/profile/me
// @desc    Get current profile
// @access  private
router.get('/me', auth, async (req, res) => {
  try {
    // here is how populate works:
    // 'user' is from the user database. So, from 'user', populate with name and avatar.
    // I think the lowercase 'user' comes from User.js, when we export.

    // we are searching for a profile that has {user: _id}, where _id is provided
    // in the request. But, we also want to populate user (from Profile model)
    // with not just the id, but also a name and avatar.
    const profile = await Profile.findOne({
      user: req.user.id,
    }).populate('user', ['name', 'avatar']);

    if (!profile) {
      return res.status(400).json({ msg: 'There is no profile for this user' });
    }

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
