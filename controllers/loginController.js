const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const handleLogin = async (req, res) => {
	const { user, pass } = req.body;
	if (!user || !pass) {
		const missingFields = [];
		if (!user) missingFields.push("username");
		if (!pass) missingFields.push("password");

		return res
			.status(400)
			.json({ error: `The following field(s) are required: ${missingFields.join(", ")}` });
	}

	// checking if a user with the inputted username or email exists
	const foundUser = await User.findOne({ $or: [{ username: user }, { email: user }] }).exec();
	if (!foundUser) return res.status(400).json({ error: "No user exists with that username" });

	// verifiying the passwords match
	const match = await bcrypt.compare(pass, foundUser.password);
	if (match) {

		const accessToken = jwt.sign(
			{
				username: foundUser.username,
				roles: foundUser.roles,
			},
			process.env.REFRESH_TOKEN_SECRET,
			{ expiresIn: "10m" }
		);

		const refreshToken = jwt.sign(
			{ username: foundUser.username },
			process.env.REFRESH_TOKEN_SECRET,
			{ expiresIn: "1d" }
		);

		foundUser.refreshToken = refreshToken;
		const result = await foundUser.save();

		// Setting the JWT as a cookie in the response
		res.cookie("jwt", refreshToken, {
			httpOnly: true,
			sameSite: "None",
			maxAge: 24 * 60 * 60 * 1000,
		}); //secure: true
		res.json({ accessToken });
	} else {
		res.status(400).json({ error: "Could not find a password associated with this user. Try again." });
	}
};

module.exports = { handleLogin };
