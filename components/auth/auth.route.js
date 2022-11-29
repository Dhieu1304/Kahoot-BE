const express = require('express');
const router = express.Router();
const authController = require('./auth.controller');
const authValidation = require('./auth.validation');
const validate = require('../middleware/validate');
const { jwtAuth } = require('../middleware/jwt.auth');

router.post('/register', validate(authValidation.registerValidate), authController.register);
router.post('/login', validate(authValidation.loginValidate), authController.login);
router.post('/resend-verify-email', jwtAuth, authController.reSendVerifyEmail);
router.get('/verify-email', validate(authValidation.verifyEmailValidate), authController.verifyEmail);
router.post('/refresh-token', validate(authValidation.refreshToken), authController.refreshToken);
router.post('/google-sign-in', validate(authValidation.googleAuth), authController.googleAuth);

module.exports = router;
