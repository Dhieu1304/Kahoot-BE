const express = require('express');
const router = express.Router();
const userController = require('./user.controller');
const { jwtAuth } = require('../middleware/jwt.auth');

router.get('/info', jwtAuth, userController.info);
// router.get('/group_all/:group_id', jwtAuth, userController.getUsersByGroupId);
router.get('/group_all/:group_id', userController.getUsersByGroupId);

module.exports = router;
