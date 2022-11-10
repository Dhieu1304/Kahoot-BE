const express = require('express');
const router = express.Router();
const authController = require("./auth.controller");
const authValidation = require("./auth.validation");
const validate = require('../middleware/validate');

router.post('/register', validate(authValidation.registerValidate), authController.register);
router.post('/login', validate(authValidation.loginValidate), authController.login);

module.exports = router;
