const express = require("express");
const router = express.Router();
const verifyController = require('../../controllers/auth/emailVerificationController');

router.get('/', verifyController.handleVerification);

module.exports = router;
