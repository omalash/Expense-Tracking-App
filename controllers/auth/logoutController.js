const User = require('../../models/User');
const jwt = require('jsonwebtoken');

const handleLogout = async (req, res) => {
	req.user = null;
	const cookies = req.cookies;
	if (!cookies?.jwt) return res.sendStatus(204);
	const refreshToken = cookies.jwt;

	const foundUser = await User.findOne({ refreshToken }).exec();
	if (!foundUser) {
		res.clearCookie('jwt', { httpOnly: true, sameSite: 'None' });
		return res.sendStatus(204);
	}

	// Delete refreshToken in the database
	foundUser.refreshToken = '';
	await foundUser.save();

	res.clearCookie('jwt', { httpOnly: true, sameSite: 'None' }); // secure: true - only serves on https
	res.sendStatus(204);
};

module.exports = { handleLogout };
