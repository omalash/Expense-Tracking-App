const express = require('express');
const router = express.Router();
const userController = require('../controllers/user/userController');
const verifyJWT = require('../middleware/verifyJWT');

// GET - api/user/:userId
router.route('/:userId').get(verifyJWT, userController.getUser);

// POST - api/user/login
router.route('/login').post(userController.loginUser);

// POST - api/user/register
router.route('/register').post(userController.registerUser);

// PUT - api/user/:userId
router.route('/:userId').put(verifyJWT, userController.editUser);

// DELETE - api/user/logout
router.route('/logout').delete(verifyJWT, userController.logoutUser);

// DELETE - api/user/:userId
router.route('/:userId').delete(verifyJWT, userController.deleteUser);

module.exports = router;
