const express = require('express');
const passport = require('passport');
const UserStore = require('../models/userStore');
const router = express.Router();
const User = require('../models/User');

router.post('/register', async (req, res) => {
  console.log('Received registration data:', req.body);
  const { email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.send('Користувач вже існує');
    }
    const newUser = new User({ email, password });
    await newUser.save();
    res.redirect(`/users`);
  } catch (err) {
    console.error(err);
        res.status(500).send('Помилка сервера');
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