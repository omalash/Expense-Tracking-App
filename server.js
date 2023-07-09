require('dotenv').config();
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const connectDB = require('./config/dbConn');
const PORT = process.env.PORT || 9000;
const verifyJWT = require('./middleware/verifyJWT');

// connects to the MongoDB dataBase
connectDB();

// Middleware
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/', require('./routes/root'));
app.use('/register', require('./routes/register'));
app.use('/verify', require('./routes/verify'));
app.use('/login', require('./routes/login'));
app.use('/refresh', require('./routes/refresh'));
app.use('/logout', require('./routes/logout'));

app.use(verifyJWT);
app.use('/transaction', require('./routes/transaction'));
  
mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});