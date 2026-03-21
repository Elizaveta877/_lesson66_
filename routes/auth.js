const express = require('express');
const passport = require('passport');
const UserStore = require('../models/userStore');
const router = express.Router();


router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  try {
    if (UserStore.findByEmail(email)) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    const newUser = await UserStore.create(email, password);
    res.status(201).json({ message: 'User registered successfully', user: { id: newUser.id, email: newUser.email } });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(400).json({ message: info.message });
    req.logIn(user, (err) => {
      if (err) return next(err);
      return res.json({ message: 'Login successful', user: { id: user.id, email: user.email } });
    });
  })(req, res, next);
});

router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) return next(err);
    res.json({ message: 'Logout successful' });

  });
});

module.exports = router;