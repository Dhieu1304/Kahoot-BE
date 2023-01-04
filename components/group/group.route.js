const express = require('express');
const router = express.Router();
const groupController = require('./group.controller');
const { jwtAuth } = require('../middleware/jwt.auth');
const validate = require('../middleware/validate');
const groupValidation = require('./group.validation');

router.get('/user/:user_id', groupController.getGroupsByUserId);
router.get('/user_owned/:user_id', groupController.getGroupsByOwnUserId);
router.get('/user_joined/:user_id', groupController.getGroupsByJoinedUserId);
router.get('/checkOwnedUser', groupController.checkOwnedUser);
router.post('/create', groupController.createGroup);
router.post('/invite/email', groupController.inviteByEmail);
router.get('/join-by-link', jwtAuth, validate(groupValidation.joinGroupByLink), groupController.joinGroupByLink);
router.get(
  '/create-invite-link',
  jwtAuth,
  validate(groupValidation.createInviteLink),
  groupController.createInviteLink,
);
router.get('/invite-mail', jwtAuth, validate(groupValidation.inviteUser), groupController.inviteUserByEmail);
router.get('/join-by-email', jwtAuth, validate(groupValidation.joinGroupByLink), groupController.joinGroupByEmail);
router.post('/delete-group/:id', jwtAuth, validate(groupValidation.deleteGroup), groupController.deleteGroup);

module.exports = router;
