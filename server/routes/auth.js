const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Start Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], prompt: 'select_account' }));

// Google OAuth callback
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/auth/failure' }), (req, res) => {
  // Generate JWT and send to client
  const user = req.user;
  const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
  // Redirect with token and user name for welcome message
  const name = encodeURIComponent(user.name || 'User');
  res.redirect(`${process.env.CLIENT_URL}/?token=${token}&name=${name}`);
});

router.get('/failure', (req, res) => {
  res.status(401).json({ message: 'Authentication failed' });
});

module.exports = router;
