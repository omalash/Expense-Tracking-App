const express = require('express');
const router = express.Router();
const logoutController = require('../../controllers/auth/logoutController');

router.delete('/', logoutController.handleLogout);

module.exports = router;