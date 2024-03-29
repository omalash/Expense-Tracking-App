const User = require('../../models/User');
const jwt = require('jsonwebtoken');

const handleRefreshToken = async (req, res) => {
	const cookies = req.cookies;
	if (!cookies?.jwt) return res.status(401).json({ error: 'Refresh token not found.' });
	const refreshToken = cookies.jwt;

	const foundUser = await User.findOne({ refreshToken }).exec();
	if (!foundUser) return res.sendStatus(403);

	jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
		if (err || foundUser._id != decoded.userId) return res.sendStatus(403);
		const accessToken = jwt.sign(
			{
				userId: decoded.userId,
			},
			process.env.ACCESS_TOKEN_SECRET,
			{ expiresIn: '10m' }
		);
		res.json({ accessToken });
	});
};

module.exports = { handleRefreshToken };
