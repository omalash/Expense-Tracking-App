require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const verifyJWT = require('./middleware/verifyJWT');
const mongoose = require('mongoose');
const connectDB = require('./config/dbConn');
const PORT = process.env.PORT || 9000;

// Enable CORS for all routes
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
);

// connects to the MongoDB dataBase
connectDB();

// Middleware
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/user', require('./routes/user'));
app.use('/api/verify', require('./routes/auth/emailVerification'));
app.use('/api/refresh', require('./routes/auth/refresh'));
app.use('/api/transaction', verifyJWT, require('./routes/transaction'));
app.use('/api/budget', verifyJWT, require('./routes/budget'));

mongoose.connection.once('open', () => {
  app.listen(PORT, () => {
    console.log(`App is listening on port ${PORT}`);
  });
});
