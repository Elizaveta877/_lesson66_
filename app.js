const express = require('express');
const session = require('express-session');
const passport = require('passport');
require('./config/passport')(passport);
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const app = express();
const authRoutes = require('./routes/auth');
const indexRoutes = require('./routes/index');


mongoose.connect(process.env.MONGO_URI) 
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.log('❌ error connected', err));


app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false,
    maxAge: 24 * 60 * 60 * 1000 
  }
}));

// 4. PASSPORT
app.use(passport.initialize());
app.use(passport.session());


app.use((req, res, next) => {
  console.log(`📡 [${req.method}] запит на: ${req.url}`);
  next();
});


app.use('/auth', authRoutes);
app.use('/', indexRoutes);


app.use(express.static('public'));

app.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.send(`
      <h1>Список користувачів з MongoDB</h1>
      <ul>
        ${users.map(user => `<li>${user.email}</li>`).join('')}
      </ul>
      <a href="/">Back to Home</a>
    `);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});