const User = require("../models/User");
const bcrypt = require("bcrypt");
const validator = require("validator");
const nodemailer = require("nodemailer");

const handleNewUser = async (req, res) => {
	const { user, pass, email, firstname, lastname } = req.body;
	if (!user || !pass || !email) {
		const missingFields = [];
		if (!user) missingFields.push("username");
		if (!pass) missingFields.push("password");
		if (!email) missingFields.push("email");

		return res
			.status(400)
			.json({ error: `The following field(s) are required: ${missingFields.join(", ")}` });
	}

	try {
		const duplicate = await User.findOne({ $or: [{ username: user }, { email: email }] }).exec();
		if (duplicate) {
			if (duplicate.username === user) {
				return res.status(409).json({ error: "Username already exists" });
			} else {
				return res.status(409).json({ error: "Email already exists" });
			}
		}

		// Validating username, password, and email
		if (!validUser(user)) {
			return res.status(500).json({ error: "Invalid username. Try again." });
		}
		if (!validPass(pass)) {
			return res.status(500).json({
				error:
					"Invalid password. Passwords must contain one uppercase, one lowercase, and has to be at least 8 characters long. Try again.",
			});
		}
		if (!validator.isEmail(email)) {
			return res.status(500).json({ error: "Invalid email. Try again." });
		}

		// Creating the email transporter using nodemailer and mailtrap as the host
		const transporter = nodemailer.createTransport({
			host: "sandbox.smtp.mailtrap.io",
			port: 2525,
			auth: {
				user: "3806b4d000d6b2",
				pass: "67d2cc06ea497b",
			},
		});

		// Generating the verification token and url
		let verificationToken = generateVerificationToken();
		let verificationUrl = generateVerificationUrl(req, verificationToken);

		// Sending the verification email
		transporter.sendMail(
			{
				from: "test@example.com",
				to: email,
				subject: "Email Verification",
				html: `
				<h1>Please verify your email</h1>
				<p>Click the button below to verify your email:</p>
				<a href="${verificationUrl}"><button>Verify Email</button></a>`,
			},

			async (err, info) => {
				if (err) {
					return res.status(500).json({ error: "Error sending email. Please try again later." });
				}
			}
		);

		const hashedPass = await bcrypt.hash(pass, 10);
		result = await User.create({
			username: user,
			password: hashedPass,
			email: email,
			firstname: firstname || "",
			lastname: lastname || "",
			verificationToken: verificationToken,
		});

		console.log(result);
		res.status(201).json({ success: `New user ${user} created. Check your email for verification.` });
	} catch (err) {
		res.status(500).json({ error: "Error creating user", message: err.message });
	}
};

// HELPER FUNCTIONS //

function validUser(user) {
	// Regular expression that excludes any special characters besides _ and .
	// the username also has to be greater then 3 characters and less then 25
	const pattern = /^[^\s!@#$%^&*()~`<>?:;'"{\}\[\]\\|\+=,-/]{3,25}$/;
	return pattern.test(user);
}

function validPass(pwd) {
	// a valid password has to be at least 8 characters and contain an uppercase and lowercase

	let length = pwd.length >= 8;
	let upperCase = /[A-Z]/.test(pwd);
	let lowerCase = /[a-z]/.test(pwd);

	return length && upperCase && lowerCase;
}

function generateVerificationToken() {
	const tokenLength = 32;
	const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	let token = "";

	for (let i = 0; i < tokenLength; i++) {
		const randomIndex = Math.floor(Math.random() * characters.length);
		token += characters.charAt(randomIndex);
	}

	return token;
}

function generateVerificationUrl(req, token) {
	const baseURL = `${req.protocol}://${req.get("host")}`;
	return `${baseURL}/verify?token=${token}`;
}

module.exports = { handleNewUser };
