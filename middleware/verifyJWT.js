const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateAccessToken = (userId) => {
	return jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '10m' });
};

const verifyJWT = async (req, res, next) => {
	const authHeader = req.headers.authorization || req.headers.Authorization;
	const token = authHeader && authHeader.split(' ')[1];
	if (!token) return res.sendStatus(401);

	try {
		const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
		const user = await User.findOne({ _id: decoded.userId }).exec();
		req.user = user;
		next();
	} catch (err) {
		return res.sendStatus(403);
	}
};

module.exports = verifyJWT;
