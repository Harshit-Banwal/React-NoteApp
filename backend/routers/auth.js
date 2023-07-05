const express = require('express');
const router = express.Router();
const User = require('../modules/User');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Fetchuser = require('../middleware/Fetchuser');

const JWT_SECRET_KEY = process.env.JWT_SECRET;

router.post(
  '/createuser',
  [
    body('name', 'enter name atleast 3 char.').isLength({ min: 3 }),
    body('email', 'valid email only').isEmail(),
    body('password', 'min lenght 5').isLength({ min: 5 }),
  ],
  async (req, res) => {
    let success = false;
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success, errors: errors.array() });
      }
      // check for the same email
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res
          .status(400)
          .json({ success, error: 'Email is already used.' });
      }

      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);

      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass,
      });

      const data = {
        user: {
          id: user.id,
        },
      };

      const authtoken = jwt.sign(data, JWT_SECRET_KEY);

      success = true;
      res.json({ success, authtoken });
    } catch (error) {
      console.log(error.message);
      res.status(500).send('something error occur.');
    }
  }
);

//Authenticate a user: using JWT token for no login detail
router.post(
  '/login',
  [
    body('email', 'valid email only').isEmail(),
    body('password', 'Password should not be blanked').exists(),
  ],
  async (req, res) => {
    success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        res.status(400).json({ error: 'Please login with valid credentials' });
      }

      const passCompare = await bcrypt.compare(password, user.password);

      if (!passCompare) {
        success = false;
        return res
          .status(400)
          .json({ success, error: 'Please login with valid credentials' });
      }

      const data = {
        user: {
          id: user.id,
        },
      };

      const authtoken = jwt.sign(data, JWT_SECRET_KEY);
      success = true;
      res.json({ success, authtoken });
    } catch (error) {
      console.log(error.message);
      res.status(500).send('something error occur.');
    }
  }
);

// Get login user detail

router.post('/getuser', Fetchuser, async (req, res) => {
  try {
    let userId = req.user.id;
    const user = await User.findById(userId).select('-password');
    res.send(user);
  } catch (error) {
    console.log(error.message);
    res.status(500).send('something error occur.');
  }
});

module.exports = router;
