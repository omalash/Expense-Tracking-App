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
app.use(cors());

// connects to the MongoDB dataBase
connectDB();

// Middleware
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/', require('./routes/root'));
app.use('/register', require('./routes/auth/register'));
app.use('/verify', require('./routes/auth/emailVerification'));
app.use('/login', require('./routes/auth/login'));
app.use('/refresh', require('./routes/auth/refresh'));
app.use('/logout', require('./routes/auth/logout'));

app.use(verifyJWT);
app.use('/transaction', require('./routes/transaction'));
app.use('/budget', require('./routes/budget'));

mongoose.connection.once('open', () => {
	app.listen(PORT);
});
