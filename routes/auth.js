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

router.post('/insert-many', async (req, res) => {
  try {
    const users = await User.insertMany(req.body);
    res.status(201).json({message: 'користувачів додано', count: users.length});
  } catch (err) {
    res.status(400).json({error: err.message})

  }
});

// update
router.put('/update-password', async (req, res) => {
  try {
    const result = await User.updateOne({
      email: req.body.email},
      {$set: {password: req.body.newPassword}}
   );
   res.json({message: 'оновлено!', details: result});
  } catch (err) {
    res.status(400).json({error: err.message})
  }
});

router.put('/replace/:id', async (req, res) => {
  try {
    const result = await User.replaceOne({
      _id: req.params.id}, req.body);
      res.json(result);
  } catch (err) {
    res.status(400).json({error: err.message})
  }
});

// delete
router.delete('/delete-one', async (req, res) => {
  try {
    const result = await User.deleteOne({
      email:req.body.email});
      res.json(result);
  } catch (err) {
    res.status(400).json({error: err.message});
  }
});


router.delete('/delete-test', async (req, res) => {
  try {
    const result = await User.deleteMany({
      email: {$regex: /test/i} });
      res.json({message: 'видалення завершено', count: result.deletedCount });
    } catch (err) {
      res.status(400).json({error: err.message});
    }
  });

module.exports = router;