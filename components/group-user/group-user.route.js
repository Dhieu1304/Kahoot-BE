const express = require('express');
const router = express.Router();
const { jwtAuth } = require('../middleware/jwt.auth');
const validate = require('../middleware/validate');
const groupUserValidation = require('./group-user.validation');
const groupUserController = require('./group-user.controller');

router.post(
  '/change-role-user',
  jwtAuth,
  validate(groupUserValidation.changeRoleUser),
  groupUserController.changeRoleUser,
);

router.post(
  '/delete-member-group',
  jwtAuth,
  validate(groupUserValidation.deleteMemberGroup),
  groupUserController.deleteMemberGroup,
);

module.exports = router;
