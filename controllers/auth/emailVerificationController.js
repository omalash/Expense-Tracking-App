const User = require("../../models/User");

const handleVerification = async (req, res) => {
	const { token } = req.query;

	const user = await User.findOne({ verificationToken: token });
	if (!user) {
		return res.status(400).json({ error: "Invalid verification token" });
	}

	// Update the emailVerified field to true
	user.emailVerified = true;
	user.verificationToken = null;
	await user.save();

	res.status(200).json({ message: "Email verification successful" });
}

module.exports = { handleVerification };