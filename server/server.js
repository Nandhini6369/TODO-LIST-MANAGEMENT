require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const passport = require('passport');
const session = require('express-session');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL, 
  credentials: true
}));
app.use(express.json());

// Session middleware (required for Passport)
app.use(session({
  secret: process.env.JWT_SECRET,
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());

// Passport config
require('./controllers/passport');

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error('MongoDB connection error:', err));

// Basic route
debugger;
app.get('/', (req, res) => {
  res.send('API is running');
});

// Auth routes
app.use('/auth', require('./routes/auth'));

// Task routes (protected)
app.use('/tasks', require('./routes/tasks'));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
