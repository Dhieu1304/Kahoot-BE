const express = require('express');
const router = express.Router();
const presentationController = require('./presentation.controller');
const presentationValidation = require('./presentation.validation');
const validate = require('../middleware/validate');
const { jwtAuth } = require('../middleware/jwt.auth');
const presentationThemeController = require('../presentation-theme/presentation-theme.controller');

router.get('/theme', presentationThemeController.listPresentationTheme);
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
router.get(
  '/:id',
  jwtAuth,
  validate(presentationValidation.presentationDetail),
  presentationController.getPresentationDetail,
);
router.get(
  '/:id/all-slide',
  jwtAuth,
  validate(presentationValidation.presentationDetail),
  presentationController.getAllSlidePresentation,
);
router.post(
  '/delete',
  jwtAuth,
  validate(presentationValidation.deletePresentation),
  presentationController.deletePresentation,
);
router.post(
  '/delete-session',
  jwtAuth,
  validate(presentationValidation.deleteSession),
  presentationController.deleteSession,
);

module.exports = router;
