const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');
const { validateUserRegistration, validateLogin } = require('../middleware/validation');

router.post('/register', validateUserRegistration, AuthController.register);
router.post('/login', validateLogin, AuthController.login);
router.post('/logout', AuthController.logout);
router.get('/me', AuthController.getCurrentUser);
router.get('/profile', AuthController.getUserProfile);

module.exports = router;