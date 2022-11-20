const express = require('express');
const router = express.Router();
const groupController = require('./group.controller');
const { jwtAuth } = require('../middleware/jwt.auth');

// router.get('/users/:id', jwtAuth, groupController.getGroupByUserId);
router.get('/users/:user_id', groupController.getGroupsByUserId);
router.get('/users_own/:user_id', groupController.getGroupsByOwnUserId);
router.get('/users_joined/:user_id', groupController.getGroupsByJoinedUserId);

router.post('/create', groupController.createGroup);

module.exports = router;
