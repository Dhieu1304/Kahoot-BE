const express = require('express');
const router = express.Router();
const authController = require('./auth.controller');
const authValidation = require('./auth.validation');
const validate = require('../middleware/validate');
const { jwtAuth } = require('../middleware/jwt.auth');

router.post('/register', validate(authValidation.registerValidate), authController.register);
router.post('/login', validate(authValidation.loginValidate), authController.login);
router.post('/resend-verify-email', jwtAuth, authController.reSendVerifyEmail);
router.post('/resend-verify-email', jwtAuth, authController.reSendVerifyEmail);
router.get('/verify-email', validate(authValidation.verifyEmailValidate), authController.verifyEmail);

module.exports = router;
