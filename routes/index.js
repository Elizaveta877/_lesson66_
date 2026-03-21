const exppress = require('express');
const router = exppress.Router();

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: 'Unauthorized' });
}

router.get('/protected', ensureAuthenticated, (req, res) => {
  res.json({ message: 'This is a protected route', user: req.user });
});

module.exports = router;