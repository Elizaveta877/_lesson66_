const express = require('express');
const session = require('express-session');
const passport = require('passport');
require('./config/passport')(passport); // Passport configuration
const app = express();
const authRoutes = require('./routes/auth');
const indexRoutes = require('./routes/index');


// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure:false,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

app.use(express.static('public')); // Serve static files from the 'public' directory
app.use(passport.initialize());
app.use(passport.session());
app.use('/auth', authRoutes);
app.use('/', indexRoutes);

app.get('/', (req, res) => {
  res.send('<h1>Welcome to the Home Page</h1>');
});




const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
