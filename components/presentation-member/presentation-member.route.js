const presentationMemberController = require('./presentation-member.controller');
const presentationMemberValidation = require('./presentation-member.validation');
const express = require('express');
const validate = require('../middleware/validate');
const { jwtAuth } = require('../middleware/jwt.auth');
const router = express.Router();

router.get('/list', validate(presentationMemberValidation.listMember), presentationMemberController.listMember);
router.post(
  '/add-co-owner',
  jwtAuth,
  validate(presentationMemberValidation.addCoOwner),
  presentationMemberController.addMember,
);
router.post(
  '/remove-co-owner',
  jwtAuth,
  validate(presentationMemberValidation.addCoOwner),
  presentationMemberController.removeMember,
);

module.exports = router;
