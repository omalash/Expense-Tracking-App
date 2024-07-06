const User = require('../../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { handleNewUser } = require('./registerController');

// GET - api/user/:userId
const getUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const foundUser = await User.findById(userId).exec();

    if (!foundUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (userId !== req.user._id.toString()) {
      return res.status(200).json({
        firstname: foundUser.firstname,
        lastname: foundUser.lastname,
        username: foundUser.username,
      });
    } else {
      return res.status(200).json({
        firstname: foundUser.firstname,
        lastname: foundUser.lastname,
        username: foundUser.username,
        email: foundUser.email,
        roles: foundUser.roles,
      });
    }
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// POST - api/user/login
const loginUser = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    const missingFields = [];
    if (!username) missingFields.push('username');
    if (!password) missingFields.push('password');

    return res.status(400).json({ error: `The following field(s) are required: ${missingFields.join(', ')}` });
  }

  // checking if a user with the inputted username or email exists
  const foundUser = await User.findOne({ $or: [{ username: username }, { email: username }] }).exec();
  if (!foundUser) return res.status(400).json({ error: 'No user exists with that username' });

  // verifiying the passwords match
  const match = await bcrypt.compare(password, foundUser.password);
  if (match) {
    const accessToken = jwt.sign({ userId: foundUser._id }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: '10m',
    });

    const refreshToken = jwt.sign({ userId: foundUser._id }, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: '1d',
    });

    foundUser.refreshToken = refreshToken;
    await foundUser.save();

    // Setting the JWT as a cookie in the response
    res.cookie('jwt', refreshToken, {
      httpOnly: true,
      sameSite: 'None',
      maxAge: 24 * 60 * 60 * 1000,
    }); //secure: true

    res.json({ accessToken });
  } else {
    res.status(400).json({ error: 'Could not find a password associated with this user. Try again.' });
  }
};

// POST - api/user/register
const registerUser = handleNewUser;

// PUT - api/user/:userId
const editUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const { firstname, lastname, username, email, password } = req.body;
    const foundUser = await User.findById(userId).exec();

    if (!foundUser) {
      return res.status(404).json({ error: 'No user exists with that username' });
    }

    foundUser.firstname = firstname || foundUser.firstname;
    foundUser.lastname = lastname || foundUser.lastname;
    foundUser.username = username || foundUser.username;
    foundUser.email = email || foundUser.email;

    if (password) {
      foundUser.password = await bcrypt.hash(password, 10);
    }

    await foundUser.save();
    res.status(200).json({ message: 'User updated successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'An error occurred while updating the user.', error: err });
  }
};

// DELETE - api/user/logout
const logoutUser = async (req, res) => {
  req.user = null;
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204);
  const refreshToken = cookies.jwt;

  const foundUser = await User.findOne({ refreshToken }).exec();
  if (!foundUser) {
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None' });
    return res.status(204).json({ message: 'Logged out successfully' });
  }

  // Delete refreshToken in the database
  foundUser.refreshToken = '';
  await foundUser.save();

  res.clearCookie('jwt', { httpOnly: true, sameSite: 'None' }); // secure: true - only serves on https
  return res.status(204).json({ message: 'Logged out successfully' });
};

// DELETE - api/user/:userId
const deleteUser = async (req, res) => {
  const userId = req.params.userId;

  const foundUser = await User.findById(userId);
  if (!foundUser) {
    return res.status(404).json({ error: 'No user exists with that username' });
  }

  try {
    await User.findByIdAndDelete(userId);
    res.status(200).json({ message: 'User deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'An error occurred while deleting the user.', error: err });
  }
};

module.exports = { loginUser, registerUser, getUser, editUser, logoutUser, deleteUser };
