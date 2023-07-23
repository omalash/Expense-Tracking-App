const express = require('express');
const router = express.Router();
const refreshTokenController = require('../../controllers/auth/refreshTokenController');

router.post('/', refreshTokenController.handleRefreshToken);

module.exports = router;