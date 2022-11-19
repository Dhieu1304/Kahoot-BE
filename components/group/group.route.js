const express = require('express');
const router = express.Router();
const groupController = require('./group.controller');
const { jwtAuth } = require('../middleware/jwt.auth');

router.get('/users:id', jwtAuth, groupController.getGroupByUserId);

module.exports = router;
