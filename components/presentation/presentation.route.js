const express = require('express');
const router = express.Router();
const presentationController = require('./presentation.controller');
const presentationValidation = require('./presentation.validation');
const validate = require('../middleware/validate');
const { jwtAuth } = require('../middleware/jwt.auth');

router.get(
  '/list',
  jwtAuth,
  validate(presentationValidation.listPresentation),
  presentationController.getListPresentation,
);
router.post(
  '/create',
  jwtAuth,
  validate(presentationValidation.createPresentation),
  presentationController.createNewPresentation,
);
router.put(
  '/edit',
  jwtAuth,
  validate(presentationValidation.editPresentation),
  presentationController.editPresentation,
);

module.exports = router;
