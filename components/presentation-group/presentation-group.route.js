const presentationGroupController = require('./presentation-group.controller');
const presentationGroupValidation = require('./presentation-group.validation');
const express = require('express');
const validate = require('../middleware/validate');
const { jwtAuth } = require('../middleware/jwt.auth');
const router = express.Router();

router.get(
  '/list',
  jwtAuth,
  validate(presentationGroupValidation.listGroup),
  presentationGroupController.listGroupPresentation,
);
router.get(
  '/list-in-group',
  jwtAuth,
  validate(presentationGroupValidation.listPresentInGroup),
  presentationGroupController.listPresentationInGroup,
);
router.post(
  '/add-group',
  jwtAuth,
  validate(presentationGroupValidation.addGroup),
  presentationGroupController.addGroupPresentation,
);
router.post(
  '/remove-group',
  jwtAuth,
  validate(presentationGroupValidation.addGroup),
  presentationGroupController.removeGroupPresentation,
);

module.exports = router;
