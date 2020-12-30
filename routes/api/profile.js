const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');

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

// @route POST api/profile
// @desc  Create or Update user profile
// @access private
// note that profile has 2 ids. From the code, we only see one, which is where
// we store the user id.
// Now, remember that mongodb genreates its own ids. So each profile gets its own
// unique id.
router.post(
  '/',
  [
    auth,
    check('status', 'Status is required').not().isEmpty(),
    check('skills', 'Skills is required').not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Build profile object
    const profileFields = {};
    profileFields.user = req.user.id;

    const fields = [
      'company',
      'website',
      'location',
      'bio',
      'status',
      'githubusername',
      'skills',
    ];

    fields.forEach((e) => {
      if (req.body[e]) {
        profileFields[e] = req.body[e];
        if (e === 'skills') {
          const skills = req.body.skills;
          profileFields.skills = skills
            .split(', ')
            .map((skill) => skill.trim());
        }
      }
    });
    profileFields.social = {};
    const socials = ['youtube', 'twitter', 'facebook', 'linkedin', 'instagram'];
    socials.forEach((e) => {
      if (req.body[e]) {
        profileFields.social[e] = req.body[e];
      }
    });

    try {
      let profile = await Profile.findOne({ user: req.user.id });

      // if there is a profile, update it.
      if (profile) {
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );

        return res.json(profile);
      }

      // create a profile
      profile = new Profile(profileFields);
      await profile.save();
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route GET api/profile
// @desc  Get all profiles
// @access public
router.get('/', async (req, res) => {
  try {
    const profiles = await Profile.find().populate('user', ['name', 'avatar']);
    res.json(profiles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route GET api/profile/user/:user_id
// @desc  Get profile by user ID
// @access public
router.get('/user/:user_id', async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id,
    }).populate('user', ['name', 'avatar']);
    if (!profile) {
      return res.status(400).json({ msg: 'Profile not found' });
    }
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    if (err.kind == 'ObjectId') {
      return res.status(400).json({ msg: 'Profile not found' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;
