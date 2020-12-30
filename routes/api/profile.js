const express = require('express');
const axios = require('axios');
const router = express.Router();
const auth = require('../../middleware/auth');
const config = require('config');
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
/* 
What is happening? When logged in, the user makes a post request to
api/profile. This route deals with this request. Perhaps it would have been better
to make it go to /api/profile/me? Doesn't matter in the end, though.

Personally, I think this should have been a PUT request since we are creating/updating
a profile. 
*/
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

// @route DELETE api/profile
// @desc  Delete Profile, user and posts
// @access private
router.delete('/', auth, async (req, res) => {
  try {
    // remove profile
    await Profile.findOneAndRemove({ user: req.user.id });
    //remove user
    await User.findOneAndRemove({ _id: req.user.id });
    res.json({ msg: 'User deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

//
// @route PUT api/profile/experience
// @desc  Add profile experience
// @access private
router.put(
  '/experience',
  [
    auth,
    check('title', 'Title is required').not().isEmpty(),
    check('company', 'Company is required').not().isEmpty(),
    check('from', 'From date is required').not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const {
      title,
      company,
      location,
      from,
      to,
      current,
      description,
    } = req.body;
    const newExp = {
      title,
      company,
      location,
      from,
      to,
      current,
      description,
    };
    try {
      const profile = await Profile.findOne({ user: req.user.id });

      profile.experience.unshift(newExp);
      await profile.save();
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route DELETE api/profile/experience/:exp_id
// @desc  delete experience from profile
// @access private
router.delete('/experience/:exp_id', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });

    // note that when we add an experience in the mongodb database,
    // mongodb gives each experience in the array its own id.
    profile.experience = profile.experience.filter(
      (exp) => exp._id.toString() !== req.params.exp_id
    );
    await profile.save();

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route PUT api/profile/education
// @desc  Add profile education
// @access private
router.put(
  '/education',
  [
    auth,
    check('school', 'School is required').not().isEmpty(),
    check('degree', 'Degree is required').not().isEmpty(),
    check('fieldofstudy', 'Field of study is required').not().isEmpty(),
    check('from', 'From date is required').not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description,
    } = req.body;
    const newEdu = {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description,
    };
    try {
      const profile = await Profile.findOne({ user: req.user.id });

      profile.education.unshift(newEdu);
      await profile.save();
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route DELETE api/profile/education/:exp_id
// @desc  delete education from profile
// @access private
router.delete('/education/:edu_id', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });

    // note that when we add an experience in the mongodb database,
    // mongodb gives each experience in the array its own id.
    profile.education = profile.education.filter(
      (edu) => edu._id.toString() !== req.params.edu_id
    );
    await profile.save();

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    GET api/profile/github/:username
// @desc     Get user repos from Github
// @access   Public
router.get('/github/:username', async (req, res) => {
  try {
    // URI is a way to identify something and URL is a way to locate something.
    // thus all URLs are URIs.
    // URI can identify documents in a short string numbers, letters, and symbols. SO, it is more general.
    // there is also URN, which is also a subset of URI. URN names the text. It identifies it by name
    // and not location. So, a book's isbn is a urn. Or uuid.
    const uri = encodeURI(
      `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc`
    );
    const headers = {
      'user-agent': 'node.js',
      Authorization: `token ${config.get('githubToken')}`,
    };
    const gitHubResponse = await axios.get(uri, { headers });
    return res.json(gitHubResponse.data);
  } catch (err) {
    console.error(err.message);
    return res.status(404).json({ msg: 'No Github profile found' });
  }
});
module.exports = router;
