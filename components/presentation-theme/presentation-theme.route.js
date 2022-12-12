const express = require('express');
const router = express.Router();
const presentationThemeController = require('./presentation-theme.controller');

router.get('/list', presentationThemeController.listPresentationTheme);

module.exports = router;
