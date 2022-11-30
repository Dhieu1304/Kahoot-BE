const express = require('express');
const router = express.Router();
const { jwtAuth } = require('../middleware/jwt.auth');
const validate = require('../middleware/validate');
const userController = require('./user.controller');
const userValidation = require('./user.validation');

router.get('/info', jwtAuth, userController.info);
router.get('/group_all/:group_id', userController.getUsersByGroupId);
router.put('/update-info', jwtAuth, validate(userValidation.updateInfo), userController.updateInfo);

module.exports = router;
