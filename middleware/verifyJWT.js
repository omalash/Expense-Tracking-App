const User = require("../models/User");
const jwt = require("jsonwebtoken");

const verifyJWT = async (req, res, next) => {
	const authHeader = req.headers.authorization || req.headers.Authorization;
	const token = authHeader && authHeader.split(" ")[1];
	if (!token) return res.sendStatus(401);

	jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
		if (err) return res.sendStatus(403);
		const user = await User.findOne({ _id: decoded.userId }).exec();
		req.user = user;
		next();
	});
};

module.exports = verifyJWT;
